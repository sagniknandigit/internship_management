import React, { useState } from "react";

const PostInternship = () => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    duration: "",
    stipend: "",
    applyBy: "",
    description: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Internship posted successfully!");
    // Here you would typically send the data to a backend service
    console.log(formData);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Post a New Internship
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Internship Title"
              className="input"
              required
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location (e.g., Remote, New York)"
              className="input"
              required
            />
            <input
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Duration (e.g., 3 Months)"
              className="input"
              required
            />
            <input
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              placeholder="Stipend (e.g., ₹10,000/month)"
              className="input"
              required
            />
            <input
              name="applyBy"
              type="date"
              value={formData.applyBy}
              onChange={handleChange}
              className="input"
              required
            />
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Required Skills (comma-separated)"
              className="input"
              required
            />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={5}
            className="textarea w-full"
            required
          />
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
