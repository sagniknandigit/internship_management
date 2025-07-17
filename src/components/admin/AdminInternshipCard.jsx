import React from "react";
import {
  IoLocationOutline,
  IoCashOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const AdminInternshipCard = ({ internship, onViewDetails }) => {
  const {
    title = "Untitled Internship",
    company = "N/A",
    location = "Not specified",
    stipend = "N/A",
    duration = "N/A",
    applyBy = "N/A",
    active = false,
    closed = false,
    applicantCount = 0,
  } = internship || {}; 

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 pr-2">{title}</h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
              closed
                ? "bg-red-100 text-red-800"
                : active
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {closed ? "Closed" : active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <IoLocationOutline className="mr-2" /> {location}
          </div>
          <div className="flex items-center">
            <IoCashOutline className="mr-2" /> {stipend}
          </div>
          <div className="flex items-center">
            <IoTimeOutline className="mr-2" /> {duration}
          </div>
          <div className="flex items-center">
            <IoCalendarOutline className="mr-2" /> Apply by: {applyBy}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-600">
          <IoPeopleOutline className="mr-2" />
          <span>{applicantCount} Applicants</span>
        </div>
        <button
          onClick={onViewDetails}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default AdminInternshipCard;
