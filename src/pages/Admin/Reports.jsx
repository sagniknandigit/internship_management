import React from "react";

const Reports = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-600">
          This page will provide analytics and reports on the internship
          program.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Application Statistics</h3>
            <p>Chart showing applications per internship.</p>
          </div>
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-bold">Hiring Funnel</h3>
            <p>Chart showing stages from application to hired.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
