import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/admin/StatsCard";
import InternshipCard from "../../components/admin/AdminInternshipCard";
import { getData, saveData } from "../../services/dataService";
import InternshipDetailsModal from "./InternshipDetailsModal";

const Dashboard = () => {
  const [enrichedInternships, setEnrichedInternships] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]); // State for last 2 applications
  const [upcomingInterviews, setUpcomingInterviews] = useState([]); // State for upcoming interviews
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAndEnrichData = useCallback(() => {
    const baseInternships = getData("internships");
    const stats = getData("internshipStats");
    const applications = getData("applications");
    const allUsers = getData("users");
    const meetings = getData("meetings"); // Fetch meetings data

    setUsers(allUsers);

    // Enriched Internships (Existing Logic)
    const enrichedInternshipsData = baseInternships.map((internship) => {
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
    setEnrichedInternships(enrichedInternshipsData);

    // --- NEW: Prepare Last 2 Applications Submitted ---
    const enrichedApplications = applications.map((app) => {
      const intern = allUsers.find((u) => u.id === app.internId);
      const internship = baseInternships.find((i) => i.id === app.internshipId);
      return {
        ...app,
        internName: intern ? intern.name : "Unknown Intern",
        internshipTitle: internship ? internship.title : "Unknown Title",
      };
    });
    // Sort by applicationDate in descending order and get the last 2
    const sortedApplications = enrichedApplications.sort(
      (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
    );
    setRecentApplications(sortedApplications.slice(0, 2)); // Get max 2 most recent applications
    // --- END NEW: Prepare Last 2 Applications Submitted ---

    // --- NEW: Prepare Upcoming Interviews (Max 3) ---
    const now = new Date();
    const formatTimeComponent = (comp) => String(comp).padStart(2, "0"); // Helper function

    const enrichedMeetings = meetings.map((meeting) => {
      const intern = allUsers.find((u) => u.id === meeting.participants[0]);
      const mentor = allUsers.find((u) => u.id === meeting.mentor);
      const internship = baseInternships.find(
        (i) => i.id === meeting.internshipId
      );

      // Recalculate end time for display if not explicitly stored
      let calculatedEndTime = "N/A";
      if (meeting.date && meeting.time && meeting.duration) {
        const tempDate = new Date(`${meeting.date}T${meeting.time}:00`);
        tempDate.setMinutes(
          tempDate.getMinutes() + parseInt(meeting.duration, 10)
        );
        calculatedEndTime = `${formatTimeComponent(
          tempDate.getHours()
        )}:${formatTimeComponent(tempDate.getMinutes())}`;
      }

      return {
        ...meeting,
        internName: intern ? intern.name : "Unknown Intern",
        mentorName: mentor ? mentor.name : "Unknown Mentor",
        internshipTitle: internship ? internship.title : "Unknown Title",
        calculatedEndTime: calculatedEndTime,
      };
    });

    const upcoming = enrichedMeetings.filter((meeting) => {
      const meetingDateTime = new Date(`${meeting.date}T${meeting.time}:00`);
      // Only consider meetings that are in the future
      return meetingDateTime > now;
    });

    // Sort upcoming meetings by date and time in ascending order
    const sortedUpcoming = upcoming.sort((a, b) => {
      const dateTimeA = new Date(`${a.date}T${a.time}:00`);
      const dateTimeB = new Date(`${b.date}T${b.time}:00`);
      return dateTimeA - dateTimeB;
    });
    setUpcomingInterviews(sortedUpcoming.slice(0, 3)); // Get max 3 upcoming interviews
    // --- END NEW: Prepare Upcoming Interviews ---
  }, []);

  useEffect(() => {
    loadAndEnrichData();
    // Add interval for real-time updates on dashboard
    const intervalId = setInterval(loadAndEnrichData, 3000);
    return () => clearInterval(intervalId);
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

  // Recent internships shown from the overall enrichedInternships
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

        {/* Recent Internship Listings Section (Existing Logic) */}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 space-y-4">
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
              <InternshipCard
                key={internship.id}
                internship={internship}
                onViewDetails={() => handleViewDetails(internship.id)}
              />
            ))}
          </div>
        </div>

        {/* Last 2 Applications Submitted Section */}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Applications
            </h2>
            <Link
              to="/admin/manage-applications"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View All
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <p className="text-gray-600">No recent applications submitted.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.applicationId}
                  className="p-3 bg-gray-50 rounded-md border border-gray-100 flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {app.internName}
                    </p>
                    <p className="text-gray-600">{app.internshipTitle}</p>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {app.applicationDate}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Interviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Upcoming Interviews
            </h2>
            <Link
              to="/admin/interview-scheduler"
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View All
            </Link>
          </div>
          {upcomingInterviews.length === 0 ? (
            <p className="text-gray-600">No upcoming interviews scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-3 bg-gray-50 rounded-md border border-gray-100 flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {meeting.internshipTitle}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">{meeting.internName}</span>{" "}
                      with{" "}
                      <span className="font-medium">{meeting.mentorName}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">{meeting.date}</p>
                    <p className="text-gray-500 text-xs">
                      {meeting.time} - {meeting.calculatedEndTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
