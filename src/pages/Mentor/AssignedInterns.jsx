import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInternsByMentorId } from "../../services/mockDataService";
import StatusBadge from "../../components/ui/StatusBadge";
import Spinner from "../../components/ui/Spinner";
import ProfileAvatar from "../../components/ui/ProfileAvatar";
import { IoEyeOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";

const AssignedInterns = () => {
  const { user } = useAuth();
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchInterns = async () => {
        setLoading(true);
        try {
          const data = await getInternsByMentorId(user.id);
          setInterns(data);
        } catch (error) {
          console.error("Failed to fetch interns:", error);
          // Here you could set an error state to show a message to the user
        } finally {
          setLoading(false);
        }
      };

      fetchInterns();
    }
  }, [user]); // Re-run effect if the user object changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Assigned Interns
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {interns.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            You have no interns assigned to you at the moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ProfileAvatar user={intern} size="sm" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {intern.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {intern.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {intern.startDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={intern.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <Link
                          to={`/mentor/interns/${intern.id}`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          title="View Details"
                        >
                          <IoEyeOutline className="mr-1" /> View
                        </Link>
                        <Link
                          to={`/mentor/chat/${intern.id}`}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                          title="Chat with Intern"
                        >
                          <IoChatbubbleEllipsesOutline className="mr-1" /> Chat
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedInterns;
