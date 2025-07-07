import React, { useEffect, useState } from "react";
import StatsCard from "../../components/admin/StatsCard";
import InternshipCard from "../../components/admin/InternshipCard";
import internshipsData from "../../mock/internship.json";
import users from "../../mock/user.json";

const Dashboard = () => {
  const [internships, setInternships] = useState([]);
  const [mentorsCount, setMentorsCount] = useState(0);
  const [internsCount, setInternsCount] = useState(0);
  const [activeInternshipsCount, setActiveInternshipsCount] = useState(0);

  useEffect(() => {
    // Load internships from mock JSON
    setInternships(internshipsData);

    // Count mentors and interns from user data
    const mentors = users.filter((user) => user.role === "Mentor");
    const interns = users.filter((user) => user.role === "Intern");

    setMentorsCount(mentors.length);
    setInternsCount(interns.length);

    const activeInternships = internshipsData.filter((job) => job.active);
    setActiveInternshipsCount(activeInternships.length);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Mentors" count={mentorsCount} icon="mentor" />
        <StatsCard title="Total Interns" count={internsCount} icon="intern" />
        <StatsCard title="Active Listings" count={activeInternshipsCount} icon="internship" />
      </div>

      {/* Internship Listing */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Internship & Job Listings
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {internships.map((job) => (
            <InternshipCard key={job.id} internship={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
