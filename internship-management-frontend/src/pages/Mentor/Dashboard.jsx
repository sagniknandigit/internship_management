import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getData } from "../../services/dataService";
import Spinner from "../../components/ui/Spinner"; // Assuming you have a Spinner component

const MentorDashboard = () => {
  const { user } = useAuth();
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentUpdates = useCallback(() => {
    setLoading(true);
    try {
      const allUpdates = getData("updates") || [];
      const relevantUpdates = allUpdates.filter((update) => {
        return (
          update.targetRole === "All" ||
          update.targetRole === user.role ||
          (update.targetRole === "Specific" && update.targetUserId === user.id)
        );
      });

      const sortedUpdates = relevantUpdates.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setRecentUpdates(sortedUpdates.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error(
        "Failed to fetch recent updates for mentor dashboard:",
        error
      );
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRecentUpdates();
      const intervalId = setInterval(fetchRecentUpdates, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user, fetchRecentUpdates]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Welcome, {user?.name || "Mentor"}!
      </h1>

      {/* Recent Updates Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Recent Updates</h2>
          <Link
            to="/mentor/notifications" // Link to a dedicated notifications page (to be created)
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            View All
          </Link>
        </div>
        {recentUpdates.length === 0 ? (
          <p className="text-gray-600">No recent updates.</p>
        ) : (
          <div className="space-y-3">
            {recentUpdates.map((update) => (
              <div
                key={update.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-100"
              >
                <p className="font-semibold text-gray-800">{update.title}</p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {update.content}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Posted by {update.postedByUserRole} on{" "}
                  {new Date(update.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Other Mentor Dashboard sections (e.g., Assigned Interns, Review Tasks, Upcoming Meetings) can go here */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Assigned Interns
        </h2>
        <p className="text-gray-600">Content for mentor's assigned interns.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tasks to Review
        </h2>
        <p className="text-gray-600">
          Content for mentor's tasks awaiting review.
        </p>
      </div>
    </div>
  );
};

export default MentorDashboard;
