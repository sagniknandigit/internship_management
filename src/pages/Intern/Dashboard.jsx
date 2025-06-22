import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  getApplicationsByInternId,
  getTasksByInternId,
  getMeetingsByInternId,
} from "../../services/mockDataService";

const StatCard = ({ title, value, linkTo, linkText, isLoading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    {isLoading ? (
      <div className="mt-2 h-9 w-12 bg-gray-200 rounded animate-pulse"></div>
    ) : (
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    )}
    {linkTo && (
      <Link
        to={linkTo}
        className="text-sm text-indigo-600 hover:underline mt-4 block"
      >
        {linkText} &rarr;
      </Link>
    )}
  </div>
);

const InternDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    appCount: 0,
    pendingTaskCount: 0,
    meetingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchDashboardData = async () => {
        setLoading(true);
        const [applications, tasks, meetings] = await Promise.all([
          getApplicationsByInternId(user.id),
          getTasksByInternId(user.id),
          getMeetingsByInternId(user.id),
        ]);

        setStats({
          appCount: applications.filter(
            (app) => app.status !== "Hired" && app.status !== "Rejected"
          ).length,
          pendingTaskCount: tasks.filter(
            (task) =>
              task.status === "Pending Review" ||
              task.status === "Needs Revision"
          ).length,
          meetingCount: meetings.length,
        });

        setLoading(false);
      };

      fetchDashboardData();
    }
  }, [user]);

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
          value={stats.appCount}
          linkTo="/intern/applications"
          linkText="View Applications"
          isLoading={loading}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTaskCount}
          linkTo="/intern/tasks"
          linkText="View Tasks"
          isLoading={loading}
        />
        <StatCard
          title="Upcoming Meetings"
          value={stats.meetingCount}
          linkTo="/intern/meetings"
          linkText="View Schedule"
          isLoading={loading}
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading activity...</p>
        ) : (
          <p className="text-gray-500">
            Your recent activity feed will appear here.
          </p>
        )}
      </div>
    </div>
  );
};

export default InternDashboard;
