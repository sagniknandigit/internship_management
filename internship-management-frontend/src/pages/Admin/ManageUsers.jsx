import React, { useState, useEffect, useCallback } from "react";
import { getData, saveData } from "../../services/dataService";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]); // State for filtered/searched users
  const [loading, setLoading] = useState(true);

  // States for search filters
  const [nameFilter, setNameFilter] = useState("");

  // States for modal and actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleChangeInfo, setRoleChangeInfo] = useState({
    userId: null,
    newRole: null,
    userName: "",
    currentRole: "",
  });
  const [deleteUserInfo, setDeleteUserInfo] = useState({
    userId: null,
    userName: "",
  });
  const [actionType, setActionType] = useState(null); // 'roleChange' or 'delete'

  const [globalMessage, setGlobalMessage] = useState({ type: "", text: "" }); // For success/error messages

  // Function to fetch users from local storage
  const fetchUsers = useCallback(() => {
    setLoading(true);
    try {
      const storedUsers = getData("users");
      setUsers(storedUsers); // Set the full list of users
    } catch (error) {
      console.error("Failed to load users:", error);
      setGlobalMessage({ type: "error", text: "Failed to load users." });
    } finally {
      setLoading(false);
    }
  }, []); // useCallback with empty dependency array as it only depends on getData

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 3000); // Refresh every 3 seconds
    return () => clearInterval(intervalId); // Cleanup interval
  }, [fetchUsers]); // Dependency on fetchUsers to avoid stale closures

  // Effect to apply name filter whenever users data or nameFilter changes
  useEffect(() => {
    let tempUsers = [...users];

    if (nameFilter) {
      tempUsers = tempUsers.filter((user) =>
        user.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    setDisplayedUsers(tempUsers); // Set the filtered list for display
  }, [users, nameFilter]);

  // Define role options dynamically based on current user's role
  const getRoleOptions = (currentUserRole) => {
    switch (currentUserRole) {
      case "Admin":
        return ["Admin", "Suspend"]; // Admin can only remain Admin or be suspended
      case "Mentor":
        return ["Mentor", "Admin", "Suspend"]; // Mentor can be Mentor, Admin, or Suspended
      case "Intern":
        return ["Intern", "Mentor", "Suspend"]; // Intern can be Intern, Mentor, or Suspended
      case "Suspend":
        // A suspended user can be reactivated to any core role, or remain suspended
        return ["Intern", "Mentor", "Admin", "Suspend"];
      default:
        // Default case for any new or unknown roles, allowing broad changes
        return ["Intern", "Mentor", "Admin", "Suspend"];
    }
  };

  // Handlers for role change action
  const handleRoleSelect = (userId, newRole, userName, currentRole) => {
    if (newRole !== currentRole) {
      setRoleChangeInfo({ userId, newRole, userName, currentRole });
      setActionType("roleChange");
      setIsModalOpen(true);
      setGlobalMessage({ type: "", text: "" }); // Clear any global messages
    }
  };

  const handleConfirmRoleChange = () => {
    const { userId, newRole } = roleChangeInfo;
    try {
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      saveData("users", updatedUsers); // Save updated users to local storage
      setUsers(updatedUsers); // Update local state for immediate UI refresh
      setIsModalOpen(false);
      setGlobalMessage({
        type: "success",
        text: `${roleChangeInfo.userName}'s role changed to ${newRole} successfully!`,
      });
    } catch (error) {
      console.error("Failed to update user role:", error);
      setGlobalMessage({
        type: "error",
        text: `Failed to change ${roleChangeInfo.userName}'s role.`,
      });
    } finally {
      setRoleChangeInfo({
        userId: null,
        newRole: null,
        userName: "",
        currentRole: "",
      });
      setActionType(null);
      setTimeout(() => setGlobalMessage({ type: "", text: "" }), 3000);
    }
  };

  // Handlers for user deletion action
  const handleRemoveUser = (userId, userName) => {
    setDeleteUserInfo({ userId, userName });
    setActionType("delete");
    setIsModalOpen(true);
    setGlobalMessage({ type: "", text: "" }); // Clear any global messages
  };

  const handleConfirmDelete = () => {
    const { userId } = deleteUserInfo;
    try {
      const updatedUsers = users.filter((user) => user.id !== userId);
      saveData("users", updatedUsers); // Save updated user list to local storage
      setUsers(updatedUsers); // Update local state for immediate UI refresh
      setIsModalOpen(false);
      setGlobalMessage({
        type: "success",
        text: `${deleteUserInfo.userName} has been deleted successfully!`,
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      setGlobalMessage({
        type: "error",
        text: `Failed to delete ${deleteUserInfo.userName}.`,
      });
    } finally {
      setDeleteUserInfo({ userId: null, userName: "" });
      setActionType(null);
      setTimeout(() => setGlobalMessage({ type: "", text: "" }), 3000);
    }
  };

  // Universal modal confirm/cancel handlers
  const handleConfirm = () => {
    if (actionType === "roleChange") {
      handleConfirmRoleChange();
    } else if (actionType === "delete") {
      handleConfirmDelete();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRoleChangeInfo({
      userId: null,
      newRole: null,
      userName: "",
      currentRole: "",
    });
    setDeleteUserInfo({ userId: null, userName: "" });
    setActionType(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Manage Users
        </h1>
        {globalMessage.text && (
          <div
            className={`mb-4 p-3 rounded-md ${
              globalMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {globalMessage.text}
          </div>
        )}

        {/* Search Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-xl mb-6 border border-gray-100">
          <div className="form-group">
            <label
              htmlFor="nameFilter"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Search by Name:
            </label>
            <input
              id="nameFilter"
              name="nameFilter"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="e.g., Aarav Kumar"
              className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">
          <div className="overflow-x-auto">
            {displayedUsers.length === 0 && nameFilter ? (
              <p className="text-center text-gray-600 py-4">
                No users found matching "{nameFilter}".
              </p>
            ) : displayedUsers.length === 0 ? (
              <p className="text-center text-gray-600 py-4">
                No users available.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleSelect(
                              user.id,
                              e.target.value,
                              user.name,
                              user.role
                            )
                          }
                          className="input-field w-full"
                        >
                          {getRoleOptions(user.role).map((roleOption) => (
                            <option key={roleOption} value={roleOption}>
                              {roleOption}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role !== "Admin" && ( // Prevent admin from deleting other admins via this button
                          <button
                            onClick={() => handleRemoveUser(user.id, user.name)}
                            className="px-3 py-1 rounded-md text-sm bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={
          actionType === "roleChange"
            ? "Confirm Role Change"
            : "Confirm User Deletion"
        }
      >
        {actionType === "roleChange" && (
          <>
            <p>
              Are you sure you want to change{" "}
              <span className="font-bold">{roleChangeInfo.userName}</span>'s
              role from{" "}
              <span className="font-bold">{roleChangeInfo.currentRole}</span> to{" "}
              <span className="font-bold">{roleChangeInfo.newRole}</span>?
            </p>
            <p className="mt-2 text-sm text-red-500">
              This action will alter the user's access permissions.
              {roleChangeInfo.newRole === "Suspend" && (
                <span className="font-bold block mt-1">
                  This user will NOT be able to log in.
                </span>
              )}
            </p>
          </>
        )}
        {actionType === "delete" && (
          <>
            <p>
              Are you sure you want to delete user{" "}
              <span className="font-bold">{deleteUserInfo.userName}</span>?
            </p>
            <p className="mt-2 text-sm text-red-500 font-bold">
              This action is permanent. The user will be removed from the system
              and will NOT be able to log in.
            </p>
          </>
        )}
      </ConfirmationModal>
    </>
  );
};

export default ManageUsers;
