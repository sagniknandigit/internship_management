import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  getInternsByMentorId,
  getTasksForMentorReview,
  getMeetingsByMentorId,
} from "../../services/mockDataService";
import Spinner from "../../components/ui/Spinner";

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

const MentorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    internCount: 0,
    reviewTaskCount: 0,
    meetingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchDashboardData = async () => {
        setLoading(true);
        // Fetch all data in parallel for efficiency
        const [interns, tasks, meetings] = await Promise.all([
          getInternsByMentorId(user.id),
          getTasksForMentorReview(user.id),
          getMeetingsByMentorId(user.id),
        ]);

        setStats({
          internCount: interns.length,
          reviewTaskCount: tasks.filter(
            (task) => task.status === "Pending Review"
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
        Mentor Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Welcome back, {user?.name}! Manage your interns and tasks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Interns"
          value={stats.internCount}
          linkTo="/mentor/interns"
          linkText="Manage Interns"
          isLoading={loading}
        />
        <StatCard
          title="Tasks to Review"
          value={stats.reviewTaskCount}
          linkTo="/mentor/tasks"
          linkText="Review Tasks"
          isLoading={loading}
        />
        <StatCard
          title="Upcoming Meetings"
          value={stats.meetingCount}
          linkTo="/mentor/meetings"
          linkText="View Schedule"
          isLoading={loading}
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Intern Submissions
        </h2>
        {loading ? (
          <p className="text-gray-500">Loading activity...</p>
        ) : (
          <p className="text-gray-500">
            A feed of recent task submissions will appear here.
          </p>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
