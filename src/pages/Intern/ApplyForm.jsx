import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { getData, saveData } from "../../services/dataService";

const ApplyForm = () => {
  const { user } = useAuth();
  const { internshipId } = useParams();

  // Generate options for "Expected Passing Year"
  const currentYear = new Date().getFullYear();
  const passingYearOptions = [];
  for (let i = 0; i <= 50; i++) {
    passingYearOptions.push(currentYear + i);
  }

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    middleName: "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    university: "",
    currentYear: "", // Will be selected from dropdown
    passingYear: "", // Will be selected from dropdown
    github: "",
    linkedin: "",
    whyInternship: "",
    skills: [],
    expectations: "",
    resume: null,
    coverLetter: null,
  });

  const [selectedSkillOptions, setSelectedSkillOptions] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const skillOptions = [
    { value: "Java", label: "Java" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "Python", label: "Python" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "CSS", label: "CSS" },
    { value: "HTML", label: "HTML" },
    { value: "SQL", label: "SQL" },
    { value: "C++", label: "C++" },
    { value: "Ruby", label: "Ruby" },
    { value: "PHP", label: "PHP" },
    { value: "Swift", label: "Swift" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0]?.name : value,
    }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkillOptions(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      skills: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "address",
      "city",
      "state",
      "university",
      "currentYear",
      "passingYear",
      "whyInternship",
      "expectations",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (
      missingFields.length > 0 ||
      formData.skills.length === 0 ||
      !formData.resume ||
      !formData.coverLetter
    ) {
      setErrorMessage(
        "Please fill in all required fields and upload both files."
      );
      return;
    }

    try {
      const existingApplications = getData("applications") || [];

      const newApplication = {
        applicationId: `app_${Date.now()}`,
        internId: user.id,
        internshipId: internshipId,
        applicationDate: new Date().toISOString().split("T")[0],
        status: "Submitted",
        ...formData,
      };

      const updatedApplications = [...existingApplications, newApplication];
      saveData("applications", updatedApplications);

      const allInternshipStats = getData("internshipStats") || [];
      const targetInternshipStatIndex = allInternshipStats.findIndex(
        (stat) => stat.id === internshipId
      );

      if (targetInternshipStatIndex !== -1) {
        const updatedStat = {
          ...allInternshipStats[targetInternshipStatIndex],
        };
        updatedStat.applicationCount = (updatedStat.applicationCount || 0) + 1;
        if (user?.name && !updatedStat.applicants.includes(user.name)) {
          updatedStat.applicants.push(user.name);
        }
        allInternshipStats[targetInternshipStatIndex] = updatedStat;
        saveData("internshipStats", allInternshipStats);
      } else {
        console.warn(
          `Internship stats entry not found for ID: ${internshipId}. Creating new entry.`
        );
        const internshipDetails = (getData("internships") || []).find(
          (i) => i.id === internshipId
        );
        if (internshipDetails) {
          const newStatEntry = {
            id: internshipId,
            title: internshipDetails.title,
            applicationCount: 1,
            applicants: user?.name ? [user.name] : [],
            active: true,
            closed: false,
            listingType: "Internship",
          };
          saveData("internshipStats", [...allInternshipStats, newStatEntry]);
        }
      }

      setSuccessMessage("Application submitted successfully!");
      setFormData({
        firstName: user?.name?.split(" ")[0] || "",
        middleName: "",
        lastName: user?.name?.split(" ").slice(1).join(" ") || "",
        email: user?.email || "",
        address: "",
        city: "",
        state: "",
        university: "",
        currentYear: "",
        passingYear: "",
        github: "",
        linkedin: "",
        whyInternship: "",
        skills: [],
        expectations: "",
        resume: null,
        coverLetter: null,
      });
      setSelectedSkillOptions(null);
    } catch (error) {
      console.error("Failed to submit application:", error);
      setErrorMessage("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
        Internship Application Form
      </h1>
      {successMessage && (
        <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label
              htmlFor="firstName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g., John"
              className="input-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="middleName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Middle Name (Optional)
            </label>
            <input
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="e.g., David"
              className="input-field w-full"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="lastName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g., Doe"
              className="input-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., john.doe@example.com"
              className="input-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="address"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Home Address
            </label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., 123 Main St"
              className="input-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="city"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              City
            </label>
            <input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., New York"
              className="input-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="state"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              State
            </label>
            <input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g., NY"
              className="input-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="university"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              University
            </label>
            <input
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="e.g., University of California, Berkeley"
              className="input-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="currentYear"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Current Year of Study
            </label>
            <select
              id="currentYear"
              name="currentYear"
              value={formData.currentYear}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </div>
          <div className="form-group">
            <label
              htmlFor="passingYear"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Expected Passing Year
            </label>
            <select
              id="passingYear"
              name="passingYear"
              value={formData.passingYear}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              <option value="">Select Year</option>
              {passingYearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label
              htmlFor="github"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              GitHub Profile Link (Optional)
            </label>
            <input
              id="github"
              name="github"
              type="url"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
              className="input-field w-full"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="linkedin"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              LinkedIn Profile Link (Optional)
            </label>
            <input
              id="linkedin"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="input-field w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="form-group">
            <label
              htmlFor="whyInternship"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Why do you want this internship?
            </label>
            <textarea
              id="whyInternship"
              name="whyInternship"
              value={formData.whyInternship}
              onChange={handleChange}
              placeholder="Explain your motivation, what excites you about this role, and how it aligns with your career goals."
              rows={3}
              className="textarea-field w-full"
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="skills"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Your Skills
            </label>
            <CreatableSelect
              id="skills"
              value={selectedSkillOptions}
              onChange={handleSkillsChange}
              options={skillOptions}
              placeholder="Select or type your relevant skills (e.g., Python, Data Analysis, Teamwork)"
              isMulti
              className="w-full border border-black rounded-md "
              required
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="expectations"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              What do you expect to learn?
            </label>
            <textarea
              id="expectations"
              name="expectations"
              value={formData.expectations}
              onChange={handleChange}
              placeholder="Describe your key learning objectives and what you hope to gain from this experience."
              rows={3}
              className="textarea-field w-full"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label
              htmlFor="resume"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Upload Resume (PDF)
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleChange}
              className="file-input w-full"
              required
            />
            {formData.resume && (
              <p className="text-xs text-gray-500 mt-1">
                File selected: {formData.resume}
              </p>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="coverLetter"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Upload Cover Letter (PDF)
            </label>
            <input
              type="file"
              id="coverLetter"
              name="coverLetter"
              accept=".pdf"
              onChange={handleChange}
              className="file-input w-full"
              required
            />
            {formData.coverLetter && (
              <p className="text-xs text-gray-500 mt-1">
                File selected: {formData.coverLetter}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
