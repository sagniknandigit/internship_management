import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMeetingsByInternId } from "../../services/mockDataService";

const InternMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getMeetingsByInternId(user.id).then((data) => {
        setMeetings(data);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredMeetings = meetings.filter((meeting) => {
    return statusFilter === "all" || meeting.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "text-blue-600";
      case "Completed":
        return "text-green-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">My Meetings</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        {["all", "Scheduled", "Completed"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {status === "all" ? "All Status" : `${status} Status`}
          </button>
        ))}
      </div>
      
      {loading ? (
        <p className="text-gray-500">Loading meetings...</p>
      ) : filteredMeetings.length === 0 ? (
        <p className="text-gray-500">No meetings found for the selected status.</p>
      ) : (
        <div className="space-y-4">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white shadow border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {meeting.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {meeting.date} at {meeting.time}
                </p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className={`font-medium ${getStatusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternMeetings;
