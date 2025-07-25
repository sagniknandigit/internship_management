import React, { useState, useEffect, useCallback } from "react";
import InternshipCard from "../../components/admin/AdminInternshipCard";
import Pagination from "../../components/ui/Pagination";
import { getData, saveData } from "../../services/dataService";
import InternshipDetailsModal from "./InternshipDetailsModal";

const AllInternships = () => {
  const [enrichedInternships, setEnrichedInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]); // State for filtered internships
  const [titleFilter, setTitleFilter] = useState(""); // State for search filter by title
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const internshipsPerPage = 9;

  const loadAndEnrichData = useCallback(() => {
    // console.log("--- Starting to load and enrich data ---");
    const baseInternships = getData("internships");
    const stats = getData("internshipStats");
    const applications = getData("applications");

    // console.log("Base Internships Loaded:", baseInternships);
    // console.log("Stats Loaded:", stats);
    // console.log("Applications Loaded:", applications);

    if (!baseInternships || baseInternships.length === 0) {
      console.error(
        "CRITICAL: No base internships were found. Check your internship.json file and dataService.js"
      );
      return;
    }

    const enrichedData = baseInternships.map((internship) => {
      const stat = stats.find((s) => s.id === internship.id) || {};
      const applicantCount = applications.filter(
        (app) => app.internshipId === internship.id
      ).length;

      return {
        ...internship,
        active: stat.active || false,
        closed: stat.closed || false,
        applicantCount,
      };
    });

    // console.log("Final Enriched Data:", enrichedData);
    setEnrichedInternships(enrichedData);
  }, []);

  useEffect(() => {
    loadAndEnrichData();
    // Optionally add interval for real-time updates like in other admin pages
    const intervalId = setInterval(loadAndEnrichData, 3000);
    return () => clearInterval(intervalId);
  }, [loadAndEnrichData]);

  // Effect to apply title filter whenever enrichedInternships or titleFilter changes
  useEffect(() => {
    let tempInternships = [...enrichedInternships];

    if (titleFilter) {
      tempInternships = tempInternships.filter((internship) =>
        internship.title.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }
    setFilteredInternships(tempInternships);
    setCurrentPage(1); // Reset to the first page when filter changes
  }, [enrichedInternships, titleFilter]);

  const handleViewDetails = (internshipId) => {
    const allUsers = getData("users");
    const allApplications = getData("applications");
    const targetInternship = enrichedInternships.find(
      (i) => i.id === internshipId
    );
    if (!targetInternship) return;
    const applicantIds = allApplications
      .filter((app) => app.internshipId === internshipId)
      .map((app) => app.internId);
    // Ensure only unique applicants and enrich with full user details
    const uniqueApplicantIds = [...new Set(applicantIds)];
    const applicantDetails = allUsers.filter((user) =>
      uniqueApplicantIds.includes(user.id)
    );

    setSelectedInternship(targetInternship);
    setApplicants(applicantDetails);
    setIsModalOpen(true);
  };

  const handleEndInternship = (internshipId) => {
    const stats = getData("internshipStats");
    const updatedStats = stats.map((stat) =>
      stat.id === internshipId ? { ...stat, active: false, closed: true } : stat
    );
    saveData("internshipStats", updatedStats);
    loadAndEnrichData(); // Reload data to reflect changes
    setIsModalOpen(false); // Close modal after action
  };

  // Pagination calculations now based on filteredInternships
  const indexOfLastInternship = currentPage * internshipsPerPage;
  const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
  const currentInternships = filteredInternships.slice(
    indexOfFirstInternship,
    indexOfLastInternship
  );
  const totalPages = Math.ceil(filteredInternships.length / internshipsPerPage);

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          All Internship Listings
        </h1>

        {/* Search Filter Section */}
        <div className="rounded-lg mb-6 border-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="form-group md:col-span-2">
              {" "}
              {/* Takes 2 columns on medium screens */}
              <label
                htmlFor="titleFilter"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Search by Title:
              </label>
              <input
                id="titleFilter"
                name="titleFilter"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                placeholder="e.g., Software Development Intern"
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex items-end h-full">
              {" "}
              {/* Aligns button to the bottom */}
              <button
                onClick={() => setTitleFilter("")} // Reset button clears the filter
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors duration-200"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {currentInternships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onViewDetails={() => handleViewDetails(internship.id)}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center text-gray-600 mt-8">
            <p>
              No internships to display{" "}
              {titleFilter && `matching "${titleFilter}"`}.
            </p>
            {!titleFilter && ( // Only show this if no filter is applied
              <p className="text-sm mt-2">
                Check the browser console (F12) for error messages or ensure
                data is present.
              </p>
            )}
          </div>
        )}
      </div>

      <InternshipDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        internship={selectedInternship}
        applicants={applicants}
        onEndInternship={handleEndInternship}
      />
    </>
  );
};

export default AllInternships;
