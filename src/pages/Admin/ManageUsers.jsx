import React, { useState, useEffect } from "react";
import initialUsers from "../../mock/user.json"; 
import ConfirmationModal from "../../components/ui/ConfirmationModal"; 

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleChangeInfo, setRoleChangeInfo] = useState({
    userId: null,
    newRole: null,
    userName: "",
  });

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  const handleRoleSelect = (userId, newRole, userName) => {
    const currentUserRole = users.find((u) => u.id === userId)?.role;
    if (newRole !== currentUserRole) {
      setRoleChangeInfo({ userId, newRole, userName });
      setIsModalOpen(true);
    }
  };

  const handleConfirmRoleChange = () => {
    const { userId, newRole } = roleChangeInfo;
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    setIsModalOpen(false); 
    setRoleChangeInfo({ userId: null, newRole: null, userName: "" }); 
  };

  const handleCancelRoleChange = () => {
    setIsModalOpen(false);
    setRoleChangeInfo({ userId: null, newRole: null, userName: "" });
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleSelect(user.id, e.target.value, user.name)
                        }
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Intern">Intern</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelRoleChange}
        onConfirm={handleConfirmRoleChange}
        title="Confirm Role Change"
      >
        <p>
          Are you sure you want to change{" "}
          <span className="font-bold">{roleChangeInfo.userName}</span>'s role to{" "}
          <span className="font-bold">{roleChangeInfo.newRole}</span>?
        </p>
        <p className="mt-2 text-sm text-red-500">
          This action may alter the user's permissions and dashboard view.
        </p>
      </ConfirmationModal>
    </>
  );
};

export default ManageUsers;
