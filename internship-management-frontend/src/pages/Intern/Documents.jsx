import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import sharedDocuments from "../../mock/sharedDocuments.json";

const Documents = () => {
  const { user } = useAuth();
  const [mentorDocs, setMentorDocs] = useState([]);
  const [internDocs, setInternDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    file: null,
  });

  useEffect(() => {
    if (user?.id) {
      // Mentor shared
      const mentorShared = sharedDocuments.filter(
        (doc) => doc.internId === user.id
      );
      setMentorDocs(mentorShared);

      // Intern uploaded
      const internStored =
        JSON.parse(localStorage.getItem("internDocuments")) || [];
      const myDocs = internStored.filter((doc) => doc.internId === user.id);
      setInternDocs(myDocs);

      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.file) {
      alert("Please provide both title and file.");
      return;
    }

    const newDoc = {
      id: "doc_" + Date.now(),
      internId: user.id,
      title: formData.title,
      fileName: formData.file.name,
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    const prevDocs = JSON.parse(localStorage.getItem("internDocuments")) || [];
    const updated = [...prevDocs, newDoc];
    localStorage.setItem("internDocuments", JSON.stringify(updated));
    setInternDocs(updated.filter((d) => d.internId === user.id));

    setFormData({ title: "", file: null });
    alert("Document uploaded successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Shared Documents</h2>

      {/* MENTOR SHARED */}
      {loading ? (
        <p className="text-gray-600">Loading Documents...</p>
      ) : mentorDocs.length === 0 ? (
        <p className="text-gray-600">No mentor-shared documents yet.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">File</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uploaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mentorDocs.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer">
                    <a href={`/${doc.fileName}`} target="_blank" rel="noopener noreferrer">
                      {doc.fileName}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doc.uploadedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Documents</h2>
      <form onSubmit={handleUpload} className="mb-8 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Document Title (e.g., Resume)"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Upload Document
        </button>
      </form>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Uploaded Documents</h2>
      {internDocs.length === 0 ? (
        <p className="text-gray-600">You haven't uploaded any documents yet.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">File</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Uploaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {internDocs.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 hover:underline">
                    <a href={`/${doc.fileName}`} target="_blank" rel="noopener noreferrer">
                      {doc.fileName}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Documents;
