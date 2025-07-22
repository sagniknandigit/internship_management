import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { useAuth } from "../../context/AuthContext";
import { getData } from "../../services/dataService";

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
  const [allInternships, setAllInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredApplications, setFilteredApplications] = useState([]);

  // Memoized function to get internship details
  const getInternship = useCallback(
    (id) => {
      return allInternships.find((i) => i.id === id);
    },
    [allInternships]
  ); // Dependency of useCallback is allInternships

  // Fetch all applications and internships from local storage on component mount and refresh periodically
  useEffect(() => {
    const fetchData = () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const allApps = getData("applications") || []; // Fetch all applications from local storage
        const currentUserApps = allApps.filter(
          (app) => app.internId === user.id
        ); //

        const internshipsData = getData("internships") || []; // Fetch all internships from local storage

        setApplications(currentUserApps);
        setAllInternships(internshipsData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch

    // Periodically refresh data from local storage to show real-time changes
    const intervalId = setInterval(fetchData, 3000); // Refresh every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [user]); // Depend on user to refetch if user changes

  // Apply filters and sorting whenever applications, filters, or sortOrder change
  useEffect(() => {
    let temp = [...applications];

    if (statusFilter !== "All") {
      temp = temp.filter((app) => app.status === statusFilter);
    }

    // Filter out applications where internship details might be missing (e.g., if internship was deleted)
    temp = temp.filter((app) => getInternship(app.internshipId));

    if (sortOrder === "newest") {
      temp.sort(
        (a, b) =>
          new Date(getInternship(b.internshipId)?.applyBy) -
          new Date(getInternship(a.internshipId)?.applyBy)
      );
    } else {
      temp.sort(
        (a, b) =>
          new Date(getInternship(a.internshipId)?.applyBy) -
          new Date(getInternship(b.internshipId)?.applyBy)
      );
    }
    setFilteredApplications(temp);
  }, [statusFilter, sortOrder, applications, getInternship]); // Added getInternship to dependencies

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Applications</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Filter by Status */}
        <div className="form-group flex-1">
          <label
            htmlFor="statusFilter"
            className="block text-sm text-gray-700 font-bold mb-2"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full"
          >
            <option>All</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Shortlisted</option>
            <option>Hired</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="form-group flex-1">
          <label
            htmlFor="sortOrder"
            className="block text-sm text-gray-700 font-bold mb-2"
          >
            Sort by:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="input-field w-full"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading applications...</p>
      ) : filteredApplications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const internship = getInternship(app.internshipId);
            // Only render if internship details are found
            if (!internship) return null;

            return (
              <div
                key={app.applicationId}
                className="bg-white shadow-md p-5 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-indigo-700">
                    {internship.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Location: {internship.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Stipend: {internship.stipend}
                  </p>
                  <p className="text-sm text-gray-600">
                    Apply By: {internship.applyBy}
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
