import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, linkTo, linkText, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      {icon && <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">{icon}</div>}
    </div>
    {linkTo && (
      <Link to={linkTo} className="text-sm text-indigo-600 hover:underline mt-4 block pt-2 border-t border-gray-100">
        {linkText} &rarr;
      </Link>
    )}
  </div>
);

const MentorDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Mentor Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Welcome back, {user?.name}! Manage your interns and tasks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Interns"
          value="4"
          linkTo="/mentor/interns"
          linkText="Manage Interns"
        />
        <StatCard
          title="Tasks to Review"
          value="8"
          linkTo="/mentor/tasks"
          linkText="Review Tasks"
        />
        <StatCard
          title="Upcoming Meetings"
          value="2"
          linkTo="/mentor/meetings"
          linkText="View Schedule"
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Intern Submissions
        </h2>
        <p className="text-gray-500">
          A feed of recent task submissions from your interns will appear here.
        </p>
        {/* We will map over real data here later */}
      </div>
    </div>
  );
};

export default MentorDashboard;