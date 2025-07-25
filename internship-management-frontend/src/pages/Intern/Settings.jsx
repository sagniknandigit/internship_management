import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../../components/ui/ProfileAvatar";

const tabs = ["Account", "Profile", "Social", "Preferences", "Security"];

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Account");
  const [formData, setFormData] = useState({
    university: "",
    currentYear: "",
    passingYear: "",
    github: "",
    linkedin: "",
    darkMode: false,
    notifications: true,
    profilePictureUrl: user?.profilePictureUrl || null,
  });
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`settings_${user?.id}`));
    if (saved) setFormData(saved);
  }, [user]);

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePictureUrl: url }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    localStorage.setItem(`settings_${user.id}`, JSON.stringify(formData));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Account":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <ProfileAvatar user={{ profilePictureUrl: formData.profilePictureUrl, name: user.name }} size="lg" />
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                value={user.name}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                value={user.email}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border rounded"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <input
                value={user.role}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border rounded"
              />
            </div>
          </div>
        );

      case "Profile":
        return (
          <div className="space-y-4">
            <input
              name="university"
              placeholder="University Name"
              value={formData.university}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="currentYear"
              placeholder="Current Year"
              value={formData.currentYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="passingYear"
              placeholder="Passing Year"
              value={formData.passingYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        );

      case "Social":
        return (
          <div className="space-y-4">
            <input
              name="github"
              placeholder="GitHub Profile URL"
              value={formData.github}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="linkedin"
              placeholder="LinkedIn Profile URL"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        );

      case "Preferences":
        return (
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="darkMode"
                checked={formData.darkMode}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="text-sm">Enable Dark Mode</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="text-sm">Email Notifications</span>
            </label>
          </div>
        );

      case "Security":
        return (
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-800 mb-6">Settings</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4 mb-6">{renderTabContent()}</div>

      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
      >
        Save Changes
      </button>

      {success && (
        <p className="text-green-600 mt-3 text-sm">
          Changes saved successfully!
        </p>
      )}
    </div>
  );
};

export default Settings;
