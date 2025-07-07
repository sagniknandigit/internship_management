import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const ApplyForm = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    middleName: "",
    lastName: user?.name?.split(" ")[1] || "",
    email: "",
    address: "",
    city: "",
    state: "",
    university: "",
    currentYear: "",
    passingYear: "",
    github: "",
    linkedin: "",
    whyInternship: "",
    skills: "",
    expectations: "",
    resume: null,
    coverLetter: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted!");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
        Internship Application Form
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="input" />
          <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" className="input" />
          <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="input" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="input" />
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Home Address" className="input" />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="input" />
          <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="input" />
          <input name="university" value={formData.university} onChange={handleChange} placeholder="University" className="input" />
          <input name="currentYear" value={formData.currentYear} onChange={handleChange} placeholder="Current Year" className="input" />
          <input name="passingYear" value={formData.passingYear} onChange={handleChange} placeholder="Passing Year" className="input" />
          <input name="github" value={formData.github} onChange={handleChange} placeholder="GitHub Profile Link" className="input" />
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile Link" className="input" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <textarea name="whyInternship" value={formData.whyInternship} onChange={handleChange} placeholder="Why do you want this internship?" rows={3} className="textarea" />
          <textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Mention your skills" rows={3} className="textarea" />
          <textarea name="expectations" value={formData.expectations} onChange={handleChange} placeholder="What do you expect to learn?" rows={3} className="textarea" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Upload Resume (PDF)</label>
            <input type="file" name="resume" accept=".pdf" onChange={handleChange} className="file-input" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Upload Cover Letter (PDF)</label>
            <input type="file" name="coverLetter" accept=".pdf" onChange={handleChange} className="file-input" />
          </div>
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md">
          Submit Application
        </button>
      </form>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-2 text-indigo-700">Live Preview</h2>
        <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ApplyForm;
