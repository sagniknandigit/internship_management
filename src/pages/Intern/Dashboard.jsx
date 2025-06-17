import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, linkTo, linkText }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    {linkTo && (
      <Link
        to={linkTo}
        className="text-sm text-blue-600 hover:underline mt-4 block"
      >
        {linkText} &rarr;
      </Link>
    )}
  </div>
);

const InternDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome, {user?.name}!
      </h1>
      <p className="text-gray-600 mb-8">
        Here's a quick overview of your internship progress.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Applications"
          value="3"
          linkTo="/intern/applications"
          linkText="View Applications"
        />
        <StatCard
          title="Pending Tasks"
          value="5"
          linkTo="/intern/tasks"
          linkText="View Tasks"
        />
        <StatCard
          title="Upcoming Meetings"
          value="1"
          linkTo="/intern/meetings"
          linkText="View Schedule"
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500">
          Your recent activity feed will appear here.
        </p>
      </div>
    </div>
  );
};

export default InternDashboard;
