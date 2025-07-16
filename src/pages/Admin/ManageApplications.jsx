import React, { useState, useEffect } from "react";
import applications from "../../mock/applications.json";
import internships from "../../mock/internship.json";
import users from "../../mock/user.json";

const ManageApplications = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrichedApplications = applications.map((app) => {
      const intern = users.find((user) => user.id === app.internId);
      const internship = internships.find((i) => i.id === app.internshipId);
      return {
        ...app,
        internName: intern ? intern.name : "Unknown",
        internshipTitle: internship ? internship.title : "Unknown",
      };
    });
    setAllApplications(enrichedApplications);
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Manage Applications
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intern Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internship Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allApplications.map((app) => (
                <tr key={app.applicationId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.internName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.internshipTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      View Application
                    </button>
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

export default ManageApplications;
