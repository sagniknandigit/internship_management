import React, { useEffect, useState } from "react";
import internships from "../../mock/internshipstats.json";
import users from "../../mock/user.json";
import InternshipCard from "../../components/admin/AdminInternshipCard";
import StatCard from "../../components/admin/StatsCard";

const Dashboard = () => {
  const [internshipData, setInternshipData] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    setInternshipData(internships);
    setUserData(users);
  }, []);

  const mentorCount = userData.filter((u) => u.role === "Mentor").length;
  const internCount = userData.filter((u) => u.role === "Intern").length;
  const activeInternshipCount = internshipData.filter(
    (i) => i.active === true && i.closed === false
  ).length;

  return (
    <div className="flex">
      <main className="flex-1 p-6 space-y-6 bg-gray-50">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* Internship Listing */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-700">All Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
