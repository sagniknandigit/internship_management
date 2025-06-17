import React from "react";
import { useAuth } from "../../context/AuthContext";

const MentorDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Welcome to the Mentor Dashboard, {user?.name}!
      </h1>
    </div>
  );
};
export default MentorDashboard;
