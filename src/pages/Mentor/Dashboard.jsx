import React from "react";
import { Link } from "react-router-dom";

const MentorDashboard = () => {
  const assignedInterns = [
    {
      id: 1,
      name: "Alice Johnson",
      currentTask: "Developing frontend for login page",
      progress: 75,
      lastCommunication: "2 hours ago",
    },
    {
      id: 2,
      name: "Bob Williams",
      currentTask: "Researching new technologies for backend",
      progress: 40,
      lastCommunication: "Yesterday",
    },
    {
      id: 3,
      name: "Charlie Brown",
      currentTask: "Designing database schema",
      progress: 90,
      lastCommunication: "30 minutes ago",
    },
  ];

  const tasksAwaitingReview = 2;
  const unreadMessages = 5;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Mentor Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            Assigned Interns
          </h2>
          <p className="text-4xl font-bold text-gray-900">
            {assignedInterns.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            Tasks Awaiting Review
          </h2>
          <p className="text-4xl font-bold text-gray-900">
            {tasksAwaitingReview}
          </p>
          <Link
            to="/mentor/track-progress"
            className="text-blue-500 hover:underline text-sm mt-2 block"
          >
            View Tasks
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            Unread Messages
          </h2>
          <p className="text-4xl font-bold text-gray-900">{unreadMessages}</p>
          <Link
            to="/mentor/communication"
            className="text-blue-500 hover:underline text-sm mt-2 block"
          >
            Go to Messages
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Interns at a Glance
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Intern Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Current Task
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Last Communication
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              {assignedInterns.map((intern) => (
                <tr key={intern.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {intern.name}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {intern.currentTask}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${intern.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {intern.progress}%
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {intern.lastCommunication}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link
                      to={`/mentor/track-progress?internId=${intern.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
