import React from "react";

const MentorTrackProgress = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Track Intern Progress
      </h1>
      <p className="text-gray-600">
        This page will display a list of your assigned interns and allow you to
        monitor their task progress, review submissions, and provide feedback.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Intern List (Coming Soon)
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Alice Johnson - Task X (Pending Review)</li>
          <li>Bob Williams - Task Y (In Progress)</li>
        </ul>
      </div>
    </div>
  );
};

export default MentorTrackProgress;
