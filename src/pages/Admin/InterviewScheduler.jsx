import React from "react";

const InterviewScheduler = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Interview Scheduler
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-600">
          This page will contain a calendar interface to schedule interviews
          with candidates. You'll be able to select an applicant, choose a
          date/time, and send an invitation.
        </p>
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Coming Soon:</h3>
          <ul className="list-disc list-inside ml-4">
            <li>Calendar view of scheduled interviews.</li>
            <li>Form to schedule a new interview.</li>
            <li>Integration with Google Calendar or other services.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
