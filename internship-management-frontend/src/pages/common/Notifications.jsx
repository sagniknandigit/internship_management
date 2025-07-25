import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { getData, saveData } from "../../services/dataService";
import Spinner from "../../components/ui/Spinner";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAndMarkNotifications = useCallback(() => {
    setLoading(true);
    try {
      let allUpdates = getData("updates") || [];
      const relevantUpdates = [];
      const updatedUpdatesForSaving = [...allUpdates]; // Create a mutable copy for saving

      allUpdates.forEach((update, index) => {
        const isRelevant =
          update.targetRole === "All" ||
          (user && update.targetRole === user.role) ||
          (user &&
            update.targetRole === "Specific" &&
            update.targetUserId === user.id);

        if (isRelevant) {
          relevantUpdates.push(update);
          // Mark as read if not already read by this user
          if (user && !(update.readBy && update.readBy.includes(user.id))) {
            const updatedReadBy = [...(update.readBy || []), user.id];
            updatedUpdatesForSaving[index] = {
              ...update,
              readBy: updatedReadBy,
            };
          }
        }
      });

      // Save updated 'readBy' status to local storage only if there are changes
      // This is crucial for the sidebar count to reflect the change
      if (
        JSON.stringify(allUpdates) !== JSON.stringify(updatedUpdatesForSaving)
      ) {
        saveData("updates", updatedUpdatesForSaving);
      }

      // Sort relevant updates for display (newest first)
      const sortedUpdates = relevantUpdates.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(sortedUpdates);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch/mark notifications:", error);
      setErrorMessage("Failed to load notifications.");
      setLoading(false);
    }
  }, [user]); // Depend on user to re-fetch/mark if user changes

  useEffect(() => {
    if (user) {
      fetchAndMarkNotifications();
      const intervalId = setInterval(fetchAndMarkNotifications, 5000); // Refresh every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [user, fetchAndMarkNotifications]); // Added fetchAndMarkNotifications to dependencies

  if (!user) {
    return (
      <p className="text-center text-gray-600 py-8">
        Please log in to view notifications.
      </p>
    );
  }

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
        Your Notifications
      </h1>
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
          {errorMessage}
        </div>
      )}

      {notifications.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No new notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {notification.title}
              </h3>
              <p className="text-gray-700 text-sm mt-1">
                {notification.content}
              </p>

              {/* Display Image (Optional) */}
              {notification.imageFileName && (
                <div className="mt-3">
                  <img
                    src={`/images/${notification.imageFileName}`} // Assuming images are in public/images/
                    alt={notification.title}
                    className="max-w-full h-auto rounded-lg shadow-sm"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Display Attachment (Optional) */}
              {notification.attachmentFileName && (
                <div className="mt-3">
                  <a
                    href={`/attachments/${notification.attachmentFileName}`} // Assuming attachments are in public/attachments/
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:underline text-sm font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {notification.attachmentFileName} (Download)
                  </a>
                </div>
              )}

              {/* Display Call to Action (CTA) Button (Optional) */}
              {notification.ctaLabel && notification.ctaLink && (
                <div className="mt-3">
                  <a
                    href={notification.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-200"
                  >
                    {notification.ctaLabel}
                  </a>
                </div>
              )}

              <p className="text-gray-500 text-xs mt-2">
                Posted by {notification.postedByName} (
                {notification.postedByUserRole}) on{" "}
                {new Date(notification.timestamp).toLocaleString()}
                {notification.targetRole === "Specific" && (
                  <span> (Personal Message)</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
