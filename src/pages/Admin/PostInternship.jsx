import React, { useState } from "react";
import { getData, saveData } from "../../services/dataService";
import CreatableSelect from "react-select/creatable";

const PostInternship = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    duration: "", // Will now store the selected duration from dropdown
    stipend: "", // Will store the raw numerical input
    applyBy: "",
    description: "",
    skills: [], // Stores an array of selected skill values
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedSkillOptions, setSelectedSkillOptions] = useState(null); // State for CreatableSelect component's value
  const [isUnpaid, setIsUnpaid] = useState(false); // State for the 'Unpaid' checkbox

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "stipend") {
      // Allow only digits for stipend input when not unpaid
      if (!isUnpaid) {
        const numericValue = value.replace(/[^0-9]/g, "");
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Options for the CreatableSelect component
  const options = [
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

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkillOptions(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      // Map the selected options to an array of their values (strings)
      skills: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleUnpaidChange = (e) => {
    setIsUnpaid(e.target.checked);
    if (e.target.checked) {
      setFormData((prev) => ({ ...prev, stipend: "" })); // Clear stipend value when unpaid is checked
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Determine final stipend value and perform validation
    let finalStipendValue;
    if (isUnpaid) {
      finalStipendValue = "Unpaid";
    } else {
      const stipendNumeric = parseInt(formData.stipend);
      if (isNaN(stipendNumeric) || stipendNumeric <= 0) {
        setErrorMessage("Please enter a valid positive numerical stipend.");
        return;
      }
      finalStipendValue = `₹${stipendNumeric.toLocaleString("en-IN")}/month`; // Format with Indian Rupee symbol and commas
    }

    // Validate other required fields, including checking if skills array is empty and duration is selected
    if (
      !formData.title ||
      !formData.location ||
      !formData.duration || // Validate duration dropdown
      !formData.applyBy ||
      !formData.description ||
      formData.skills.length === 0 // Check if the skills array is empty
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      // Get existing internships
      const existingInternships = getData("internships");

      // Create new internship object
      const newInternship = {
        id: `int_${Date.now()}`, // Unique ID based on timestamp
        title: formData.title,
        location: formData.location,
        duration: formData.duration, // Use the selected duration
        stipend: finalStipendValue, // Use the determined stipend value
        postedOn: new Date().toISOString().split("T")[0], // Current date (YYYY-MM-DD)
        applyBy: formData.applyBy,
        description: formData.description,
        skills: formData.skills, // skills is already an array of strings
      };

      // Add the new internship to the main internships list
      const updatedInternships = [...existingInternships, newInternship];
      saveData("internships", updatedInternships);

      // --- Update internshipStats.json with the new internship's stats entry ---
      const currentStatsArray = getData("internshipStats") || []; // Get existing stats array, or an empty array if none

      const newInternshipStatEntry = {
        id: newInternship.id, // Use the ID from the newly posted internship
        title: newInternship.title, // Use the title from the newly posted internship
        applicationCount: 0,
        applicants: [],
        active: true,
        closed: false,
        listingType: "Internship",
      };
      const updatedStatsArray = [...currentStatsArray, newInternshipStatEntry];
      saveData("internshipStats", updatedStatsArray);
      // --- End of internshipStats.json update ---

      setSuccessMessage("Internship posted successfully!");
      // Clear the form fields and reset select components and checkbox
      setFormData({
        title: "",
        location: "",
        duration: "", // Reset to empty string for default dropdown option
        stipend: "",
        applyBy: "",
        description: "",
        skills: [],
      });
      setSelectedSkillOptions(null); // Reset CreatableSelect component
      setIsUnpaid(false); // Reset unpaid checkbox
    } catch (error) {
      console.error("Failed to post internship:", error);
      setErrorMessage("Failed to post internship. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Post a New Internship
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label
                htmlFor="title"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Internship Title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., AI Research Intern"
                className="input-field w-full"
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="location"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Remote, New York"
                className="input-field w-full"
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="duration"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Duration
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="">Select Duration</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="4 Months">4 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>
            <div className="form-group">
              <div className="flex justify-between items-start h-fit">
                <label
                  htmlFor="stipend"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Stipend
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isUnpaid"
                    checked={isUnpaid}
                    onChange={handleUnpaidChange}
                    className="w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isUnpaid" className="text-gray-700 text-sm">
                    Unpaid Internship
                  </label>
                </div>
              </div>

              <input
                id="stipend"
                name="stipend"
                type="text"
                value={formData.stipend}
                onChange={handleChange}
                placeholder={
                  isUnpaid ? "Unpaid" : "e.g., 25000 (numeric value)"
                }
                className="input-field w-full"
                disabled={isUnpaid}
                required={!isUnpaid}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="applyBy"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Apply By Date
              </label>
              <input
                id="applyBy"
                name="applyBy"
                type="date"
                value={formData.applyBy}
                onChange={handleChange}
                className="input-field w-full"
                required
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="skills"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Required Skills
              </label>
              <CreatableSelect
                id="skills"
                value={selectedSkillOptions}
                onChange={handleSkillsChange}
                options={options}
                placeholder="Select or type skills (e.g., Python, React)"
                isMulti
                className="w-full border border-black rounded-md "
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Contribute to ongoing research in artificial intelligence..."
              rows={5}
              className="textarea-field w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
          >
            Post Internship
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostInternship;
