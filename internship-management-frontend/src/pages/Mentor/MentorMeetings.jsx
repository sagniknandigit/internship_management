import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMeetingsByMentorId } from "../../services/mockDataService";
import Spinner from "../../components/ui/Spinner";
import { Link } from "react-router-dom";
import { IoVideocamOutline, IoCalendarOutline } from "react-icons/io5";

const MentorMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchMeetings = async () => {
        setLoading(true);
        const data = await getMeetingsByMentorId(user.id);
        setMeetings(data);
        setLoading(false);
      };
      fetchMeetings();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Meetings</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Upcoming Meetings
        </h2>
        {meetings.length > 0 ? (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-4 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {meeting.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    With:{" "}
                    <span className="font-medium">{meeting.internName}</span>
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <IoCalendarOutline className="mr-2" />
                    <span>
                      {meeting.date} at {meeting.time}
                    </span>
                  </div>
                </div>
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <IoVideocamOutline className="mr-2" />
                  Join Meeting
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            You have no upcoming meetings scheduled.
          </p>
        )}
      </div>
    </div>
  );
};

export default MentorMeetings;
