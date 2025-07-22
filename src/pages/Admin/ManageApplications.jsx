import React, { useState, useEffect, useCallback } from "react";
import { getData, saveData } from "../../services/dataService";
import ApplicationDetailsModal from "../../components/admin/ApplicationDetailsModal"; // Import the new modal component

const statusColors = {
  "Under Review": "bg-yellow-100 text-yellow-800",
  Submitted: "bg-blue-100 text-blue-800",
  Shortlisted: "bg-green-100 text-green-800",
  Hired: "bg-green-700 text-white", // Changed text-green-800 to text-white for better contrast
  Rejected: "bg-red-100 text-red-800",
  "Interview Scheduled": "bg-purple-100 text-purple-800",
};

const ManageApplications = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [displayedApplications, setDisplayedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internshipTitleFilter, setInternshipTitleFilter] = useState("");
  const [internNameFilter, setInternNameFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicationDetails, setSelectedApplicationDetails] =
    useState(null);
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState("");
  const [globalErrorMessage, setGlobalErrorMessage] = useState("");

  const fetchAndEnrichData = useCallback(() => {
    setLoading(true);
    try {
      const applicationsData = getData("applications") || [];
      const internshipsData = getData("internships") || [];
      const usersData = getData("users") || [];

      const enriched = applicationsData.map((app) => {
        const intern = usersData.find((user) => user.id === app.internId);
        const internship = internshipsData.find(
          (i) => i.id === app.internshipId
        );
        return {
          ...app,
          internName: intern ? intern.name : "Unknown",
          internEmail: intern ? intern.email : "N/A",
          internPhone: intern ? intern.phone || "N/A" : "N/A",
          internshipTitle: internship ? internship.title : "Unknown",
          internshipLocation: internship ? internship.location : "N/A",
          internshipStipend: internship ? internship.stipend : "N/A",
          internshipDuration: internship ? internship.duration : "N/A",
          internshipApplyBy: internship ? internship.applyBy : "N/A",
          applicantAddress: app.address,
          applicantCity: app.city,
          applicantState: app.state,
          applicantUniversity: app.university,
          applicantCurrentYear: app.currentYear,
          applicantPassingYear: app.passingYear,
          applicantGithub: app.github,
          applicantLinkedin: app.linkedin,
          applicantWhyInternship: app.whyInternship,
          applicantSkills: app.skills,
          applicantExpectations: app.expectations,
          resumeFileName: app.resume,
          coverLetterFileName: app.coverLetter,
        };
      });
      setAllApplications(enriched);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch and enrich data:", error);
      setGlobalErrorMessage("Failed to load applications.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndEnrichData();
    const intervalId = setInterval(fetchAndEnrichData, 3000);
    return () => clearInterval(intervalId);
  }, [fetchAndEnrichData]);

  useEffect(() => {
    let temp = [...allApplications];

    if (internshipTitleFilter) {
      temp = temp.filter((app) =>
        app.internshipTitle
          .toLowerCase()
          .includes(internshipTitleFilter.toLowerCase())
      );
    }
    if (internNameFilter) {
      temp = temp.filter((app) =>
        app.internName.toLowerCase().includes(internNameFilter.toLowerCase())
      );
    }

    setDisplayedApplications(temp);
  }, [allApplications, internshipTitleFilter, internNameFilter]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    if (name === "internshipTitle") {
      setInternshipTitleFilter(value);
    } else if (name === "internName") {
      setInternNameFilter(value);
    }
  };

  const handleResetFilters = () => {
    setInternshipTitleFilter("");
    setInternNameFilter("");
  };

  const handleViewApplication = (app) => {
    setSelectedApplicationDetails(app);
    setIsModalOpen(true);
    setGlobalSuccessMessage("");
    setGlobalErrorMessage("");
  };

  const handleStatusChangeInModal = (applicationId, newStatus) => {
    try {
      const currentApplications = getData("applications") || [];
      const updatedApplications = currentApplications.map((app) =>
        app.applicationId === applicationId
          ? { ...app, status: newStatus }
          : app
      );
      saveData("applications", updatedApplications);

      fetchAndEnrichData();

      setSelectedApplicationDetails((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );

      setGlobalSuccessMessage("Application status updated successfully!");
      setTimeout(() => setGlobalSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update application status:", error);
      setGlobalErrorMessage("Failed to update status. Please try again.");
      setTimeout(() => setGlobalErrorMessage(""), 3000);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicationDetails(null);
    setGlobalSuccessMessage("");
    setGlobalErrorMessage("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Manage Applications
      </h1>
      {globalSuccessMessage && (
        <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
          {globalSuccessMessage}
        </div>
      )}
      {globalErrorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
          {globalErrorMessage}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="form-group">
            <label
              htmlFor="internshipTitleSearch"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Search by Internship Title:
            </label>
            <input
              id="internshipTitleSearch"
              name="internshipTitle"
              value={internshipTitleFilter}
              onChange={handleSearchChange}
              placeholder="e.g., AI Research Intern"
              className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="internNameSearch"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Search by Intern Name:
            </label>
            <input
              id="internNameSearch"
              name="internName"
              value={internNameFilter}
              onChange={handleSearchChange}
              placeholder="e.g., John Doe"
              className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end h-full">
            <button
              onClick={handleResetFilters}
              className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          {displayedApplications.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No applications found matching your criteria.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Intern Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Internship Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedApplications.map((app) => (
                  <tr
                    key={app.applicationId}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.internName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {app.internshipTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusColors[app.status] ||
                          "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewApplication(app)}
                        className="px-3 py-1 rounded-md text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors duration-200"
                      >
                        View Application
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {isModalOpen && selectedApplicationDetails && (
        <ApplicationDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          applicationDetails={selectedApplicationDetails}
          onStatusChange={handleStatusChangeInModal}
          statusColors={statusColors}
        />
      )}
    </div>
  );
};

export default ManageApplications;
