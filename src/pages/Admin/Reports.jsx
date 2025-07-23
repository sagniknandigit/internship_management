import React, { useState, useEffect, useCallback } from "react";
import { getData } from "../../services/dataService";
import StatCard from "../../components/admin/StatsCard";
import Pagination from "../../components/ui/Pagination";

const Reports = () => {
  const [reportData, setReportData] = useState({
    totalUsers: 0,
    totalInterns: 0,
    totalMentors: 0,
    totalInternships: 0,
    activeInternships: 0,
    totalApplications: 0,
    totalInterviews: 0,
    applicationsByStatus: {},
    internshipPerformance: [],
    mentorWorkload: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [
    internshipPerformanceCurrentPage,
    setInternshipPerformanceCurrentPage,
  ] = useState(1);
  const internshipsPerformancePerPage = 5;

  const aggregateReportData = useCallback(() => {
    setLoading(true);
    try {
      const users = getData("users") || [];
      const internships = getData("internships") || [];
      const applications = getData("applications") || [];
      const internshipStats = getData("internshipStats") || [];
      const meetings = getData("meetings") || [];
      const mentorAssignments = getData("mentorAssignments") || {};

      // --- 1. Overall Platform Summary ---
      const totalUsers = users.length;
      const totalInterns = users.filter((u) => u.role === "Intern").length;
      const totalMentors = users.filter((u) => u.role === "Mentor").length;
      const totalInternships = internships.length;
      const activeInternships = internshipStats.filter((s) => s.active).length;
      const totalApplications = applications.length;
      const totalInterviews = meetings.length;

      // --- 2. Application Funnel Analysis ---
      const appsByStatus = applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {});

      // --- 3. Internship Performance Overview ---
      const internshipPerformanceData = internships.map((int) => {
        const relevantApps = applications.filter(
          (app) => app.internshipId === int.id
        );
        const submittedCount = relevantApps.length;
        const shortlistedCount = relevantApps.filter(
          (app) => app.status === "Shortlisted"
        ).length;
        const hiredCount = relevantApps.filter(
          (app) => app.status === "Hired"
        ).length;
        const rejectedCount = relevantApps.filter(
          (app) => app.status === "Rejected"
        ).length;
        const stat = internshipStats.find((s) => s.id === int.id) || {};
        const activeStatus = stat.active ? "Active" : "Closed";
        const conversionRate =
          submittedCount > 0
            ? ((hiredCount / submittedCount) * 100).toFixed(2)
            : 0;

        return {
          id: int.id,
          title: int.title,
          totalApplications: submittedCount,
          shortlisted: shortlistedCount,
          hired: hiredCount,
          rejected: rejectedCount,
          status: activeStatus,
          conversionRate: parseFloat(conversionRate),
        };
      });

      // --- 4. Mentor Workload ---
      const mentorWorkloadData = users
        .filter((u) => u.role === "Mentor")
        .map((mentor) => {
          const assignedInterns = mentorAssignments[mentor.id] || [];
          const conductedMeetings = meetings.filter(
            (m) => m.mentor === mentor.id
          ).length;

          const internNames = assignedInterns.map((internId) => {
            const intern = users.find((u) => u.id === internId);
            return intern ? intern.name : `Unknown Intern (${internId})`;
          });

          return {
            id: mentor.id,
            name: mentor.name,
            assignedInternCount: assignedInterns.length,
            assignedInternNames: internNames,
            interviewsConducted: conductedMeetings,
          };
        });

      setReportData({
        totalUsers,
        totalInterns,
        totalMentors,
        totalInternships,
        activeInternships,
        totalApplications,
        totalInterviews,
        applicationsByStatus: appsByStatus,
        internshipPerformance: internshipPerformanceData,
        mentorWorkload: mentorWorkloadData,
      });
    } catch (error) {
      console.error("Error aggregating report data:", error);
      setErrorMessage(
        "Failed to generate reports. Data might be missing or corrupted."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    aggregateReportData();
    const intervalId = setInterval(aggregateReportData, 5000);
    return () => clearInterval(intervalId);
  }, [aggregateReportData]);

  const indexOfLastInternshipPerformance =
    internshipPerformanceCurrentPage * internshipsPerformancePerPage;
  const indexOfFirstInternshipPerformance =
    indexOfLastInternshipPerformance - internshipsPerformancePerPage;
  const currentInternshipPerformance = reportData.internshipPerformance.slice(
    indexOfFirstInternshipPerformance,
    indexOfLastInternshipPerformance
  );
  const totalInternshipPerformancePages = Math.ceil(
    reportData.internshipPerformance.length / internshipsPerformancePerPage
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <p className="text-gray-600">Generating reports...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Admin Reports
      </h1>
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Report Filters */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Report Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="form-group">
            <label
              htmlFor="dateRange"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Date Range:
            </label>
            <select id="dateRange" className="input-field w-full">
              <option value="all">All Time</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
        </div>
        <button className="mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md">
          Apply Filters
        </button>
      </div>

      {/* 1. Overall Platform Summary */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            count={reportData.totalUsers}
            icon="total"
          />
          <StatCard
            title="Total Interns"
            count={reportData.totalInterns}
            icon="intern"
          />
          <StatCard
            title="Total Mentors"
            count={reportData.totalMentors}
            icon="mentor"
          />
          <StatCard
            title="Total Internships"
            count={reportData.totalInternships}
            icon="internship"
          />
          <StatCard
            title="Active Listings"
            count={reportData.activeInternships}
            icon="active"
          />
          <StatCard
            title="Total Applications"
            count={reportData.totalApplications}
            icon="applications"
          />
          <StatCard
            title="Total Interviews"
            count={reportData.totalInterviews}
            icon="interviews"
          />
        </div>
      </div>

      {/* 2. Application Funnel Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">
            Application Funnel Analysis
          </h2>
          <button className="py-1 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md">
            Export CSV
          </button>
        </div>
        <div className="h-64 bg-gray-50 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500">
          <p>
            Chart Placeholder: Funnel or Stacked Bar Chart of Applications by
            Status
          </p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            Status Breakdown:
          </h3>
          <ul className="list-disc list-inside text-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(reportData.applicationsByStatus).map(
              ([status, count]) => (
                <li key={status}>
                  {status}: <span className="font-bold">{count}</span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      {/* 3. Internship Performance Overview */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">
            Internship Performance
          </h2>
          <button className="py-1 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md">
            Export CSV
          </button>
        </div>
        {reportData.internshipPerformance.length === 0 ? (
          <p className="text-center text-gray-600 py-4">
            No internship performance data.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Total Apps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Shortlisted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Hired
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Hired %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInternshipPerformance.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.totalApplications}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.shortlisted}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.hired}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.rejected}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalInternshipPerformancePages > 1 && (
          <Pagination
            currentPage={internshipPerformanceCurrentPage}
            totalPages={totalInternshipPerformancePages}
            onPageChange={setInternshipPerformanceCurrentPage}
          />
        )}
      </div>

      {/* 4. Mentor Workload & Assignments */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">
            Mentor Workload & Assignments
          </h2>
          <button className="py-1 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md">
            Export CSV
          </button>
        </div>
        {reportData.mentorWorkload.length === 0 ? (
          <p className="text-center text-gray-600 py-4">
            No mentor data available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Mentor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Interns Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Assigned Interns (Names)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Interviews Conducted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.mentorWorkload.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.assignedInternCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.assignedInternNames.join(", ") || "None"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.interviewsConducted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Intern Demographics & Skills */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">
            Intern Demographics & Skills
          </h2>
          <button className="py-1 px-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm rounded-md">
            Export CSV
          </button>
        </div>
        <div className="h-64 bg-gray-50 flex items-center justify-center rounded-md border border-dashed border-gray-300 text-gray-500">
          <p>
            Chart Placeholder: Pie/Bar Charts for University, Year, Top Skills
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
