import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getData, saveData } from "../../services/dataService";
import Spinner from "../../components/ui/Spinner";

const PostUpdate = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    targetRole: "All",
    targetUserId: "",
    imageFileName: null,
    attachmentFileName: null,
    ctaLabel: "",
    ctaLink: "",
  });
  const [targetUsers, setTargetUsers] = useState([]);
  const [allUsersData, setAllUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const users = getData("users") || [];
      setAllUsersData(users);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load users for update targets:", error);
      setErrorMessage("Failed to load user list.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formData.targetRole !== "All" && allUsersData.length > 0) {
      if (formData.targetRole === "Specific") {
        setTargetUsers(
          allUsersData.filter((u) => u.role !== "Admin" && u.id !== user.id)
        );
      } else {
        setTargetUsers(
          allUsersData.filter((u) => u.role === formData.targetRole)
        );
      }
      setFormData((prev) => ({ ...prev, targetUserId: "" }));
    } else {
      setTargetUsers([]);
      setFormData((prev) => ({ ...prev, targetUserId: "" }));
    }
  }, [formData.targetRole, allUsersData, user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0].name }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    if (!formData.title || !formData.content || !formData.targetRole) {
      setErrorMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    if (formData.targetRole === "Specific" && !formData.targetUserId) {
      setErrorMessage("Please select a specific user for the update.");
      setLoading(false);
      return;
    }
    if (formData.ctaLabel && !formData.ctaLink) {
      setErrorMessage("Please provide a CTA link if a label is specified.");
      setLoading(false);
      return;
    }

    try {
      const currentUpdates = getData("updates") || [];
      const newUpdate = {
        id: `update_${Date.now()}`,
        title: formData.title,
        content: formData.content,
        postedByUserId: user.id,
        postedByUserRole: user.role,
        postedByName: user.name,
        timestamp: new Date().toISOString(),
        targetRole: formData.targetRole,
        targetUserId:
          formData.targetRole === "Specific" ? formData.targetUserId : null,

        imageFileName: formData.imageFileName,
        attachmentFileName: formData.attachmentFileName,
        ctaLabel: formData.ctaLabel,
        ctaLink: formData.ctaLink,
        readBy: [],
      };

      saveData("updates", [...currentUpdates, newUpdate]);
      setSuccessMessage("Update posted successfully!");

      setFormData({
        title: "",
        content: "",
        targetRole: "All",
        targetUserId: "",
        imageFileName: null,
        attachmentFileName: null,
        ctaLabel: "",
        ctaLink: "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to post update:", error);
      setErrorMessage("Failed to post update. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Post New Update / Announcement
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
        {/* Update Title */}
        <div className="form-group">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Update Title:
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Important System Maintenance"
            className="input-field w-full"
            required
          />
        </div>

        {/* Update Content */}
        <div className="form-group">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Update Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Provide details about the update or announcement."
            rows="6"
            className="textarea-field w-full"
            required
          />
        </div>

        {/* Target Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="targetRole"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Target Audience:
            </label>
            <select
              id="targetRole"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              <option value="All">All Users</option>
              <option value="Intern">Interns</option>
              <option value="Mentor">Mentors</option>
              <option value="Admin">Admins</option>
              <option value="Specific">Specific User</option>
            </select>
          </div>

          {/* Specific User Dropdown (Conditional) */}
          <div className="form-group">
            <label
              htmlFor="targetUserId"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Specific User (Optional):
            </label>
            <select
              id="targetUserId"
              name="targetUserId"
              value={formData.targetUserId}
              onChange={handleChange}
              // Apply visual fading/reactivity based on disabled state
              className={`input-field w-full ${
                formData.targetRole !== "Specific"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={formData.targetRole !== "Specific"}
            >
              <option value="">-- Select Specific User --</option>
              {targetUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            {formData.targetRole === "Specific" && targetUsers.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No users found for this role or specific selection.
              </p>
            )}
          </div>
        </div>

        {/* Image and Attachment Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="imageFileName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Upload Image (Optional):
            </label>
            <input
              id="imageFileName"
              name="imageFileName"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="file-input w-full"
            />
            {formData.imageFileName && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {formData.imageFileName}
              </p>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="attachmentFileName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Upload Attachment (Optional, PDF/Doc):
            </label>
            <input
              id="attachmentFileName"
              name="attachmentFileName"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleChange}
              className="file-input w-full"
            />
            {formData.attachmentFileName && (
              <p className="text-sm text-gray-500 mt-1">
                Selected: {formData.attachmentFileName}
              </p>
            )}
          </div>
        </div>

        {/* Call to Action (CTA) Button Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label
              htmlFor="ctaLabel"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              CTA Button Text (Optional):
            </label>
            <input
              id="ctaLabel"
              name="ctaLabel"
              value={formData.ctaLabel}
              onChange={handleChange}
              placeholder="e.g., Learn More"
              className="input-field w-full"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="ctaLink"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              CTA Button Link (URL, Optional):
            </label>
            <input
              id="ctaLink"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              type="url"
              placeholder="e.g., https://example.com/info"
              // Apply visual fading/reactivity based on disabled state
              className={`input-field w-full ${
                !formData.ctaLabel ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!formData.ctaLabel}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md flex items-center justify-center disabled:bg-indigo-300"
        >
          {loading ? <Spinner /> : "Post Update"}
        </button>
      </form>
    </div>
  );
};

export default PostUpdate;
