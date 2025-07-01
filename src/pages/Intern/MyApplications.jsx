import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApplicationsByInternId } from "../../services/mockDataService";
import internships from "../../mock/internship.json";

const statusColors = {
  "Under Review": "bg-yellow-100 text-yellow-800",
  Submitted: "bg-blue-100 text-blue-800",
  Shortlisted: "bg-green-100 text-green-800",
  Hired: "bg-green-300 text-white",
  Rejected: "bg-red-100 text-red-800",
};

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      const apps = await getApplicationsByInternId(user.id);
      setApplications(apps);
      setFiltered(apps);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    let data = [...applications];
    if (statusFilter !== "All") {
      data = data.filter((app) => app.status === statusFilter);
    }
    if (sortOrder === "newest") {
      data.sort((a, b) => new Date(getInternship(b.internshipId)?.applyBy) - new Date(getInternship(a.internshipId)?.applyBy));
    } else {
      data.sort((a, b) => new Date(getInternship(a.internshipId)?.applyBy) - new Date(getInternship(b.internshipId)?.applyBy));
    }
    setFiltered(data);
  }, [statusFilter, sortOrder, applications]);

  const getInternship = (id) => internships.find((i) => i.id === id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Applications</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option>All</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Shortlisted</option>
            <option>Hired</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading applications...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const internship = getInternship(app.internshipId);
            return (
              <div
                key={app.applicationId}
                className="bg-white shadow-md p-5 rounded-lg border flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {internship?.title || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-600">{internship?.location}</p>
                  <p className="text-sm text-gray-600">
                    Stipend: {internship?.stipend}
                  </p>
                  <p className="text-sm text-gray-600">
                    Apply By: {internship?.applyBy}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    statusColors[app.status] || "bg-gray-200 text-gray-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
