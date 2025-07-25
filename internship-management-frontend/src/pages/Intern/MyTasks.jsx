import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTasksByInternId } from "../../services/mockDataService";

const TaskCard = ({ task }) => {
  const statusStyles = {
    "Pending Review": "bg-yellow-100 text-yellow-800",
    "Needs Revision": "bg-red-100 text-red-800",
    "Approved": "bg-green-100 text-green-800",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <span className={`text-sm px-3 py-1 rounded-full ${statusStyles[task.status] || "bg-gray-100 text-gray-600"}`}>
          {task.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        Submitted on:{" "}
        <span className="font-medium">{task.submittedDate}</span>
      </p>
    </div>
  );
};

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasksByInternId(user?.id);
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadTasks();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Tasks</h1>

      {loading ? (
        <p className="text-gray-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned yet.</p>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  );
};

export default MyTasks;
