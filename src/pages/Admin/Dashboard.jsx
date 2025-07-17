import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/admin/StatsCard";
import InternshipCard from "../../components/admin/AdminInternshipCard";
import { getData, saveData } from "../../services/dataService";
import InternshipDetailsModal from "./InternshipDetailsModal";

const Dashboard = () => {
  const [enrichedInternships, setEnrichedInternships] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAndEnrichData = useCallback(() => {
    const baseInternships = getData("internships");
    const stats = getData("internshipStats");
    const applications = getData("applications");
    const allUsers = getData("users");

    setUsers(allUsers);

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

    setEnrichedInternships(enrichedData);
  }, []);

  useEffect(() => {
    loadAndEnrichData();
  }, [loadAndEnrichData]);

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

    const applicantDetails = allUsers.filter((user) =>
      applicantIds.includes(user.id)
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
    loadAndEnrichData(); // Reload data to reflect the change on the UI
    setIsModalOpen(false); // Close the modal
  };

  const mentorCount = users.filter((u) => u.role === "Mentor").length;
  const internCount = users.filter((u) => u.role === "Intern").length;
  const activeInternshipCount = enrichedInternships.filter(
    (i) => i.active && !i.closed
  ).length;

  const recentInternships = enrichedInternships.slice(0, 3);

  return (
    <>
      <main className="flex-1 p-6 space-y-8 bg-gray-50">
        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Mentors"
            count={mentorCount}
            color="blue"
            icon="mentor"
          />
          <StatCard
            title="Interns"
            count={internCount}
            color="green"
            icon="intern"
          />
          <StatCard
            title="Active Internships"
            count={activeInternshipCount}
            color="purple"
            icon="internship"
          />
        </div>

        {/* Recent Internship Listings Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Listings
            </h2>
            <Link
              to="/admin/all-internships"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentInternships.map((internship) => (
              // Pass the handleViewDetails function to each card
              <InternshipCard
                key={internship.id}
                internship={internship}
                onViewDetails={() => handleViewDetails(internship.id)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Render the modal component */}
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

export default Dashboard;
