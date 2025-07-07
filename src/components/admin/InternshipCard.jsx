import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";

const AdminInternshipCard = ({ internship }) => {
  const {
    id,
    title,
    listingType,
    active,
    closed,
    applicants = [],
  } = internship;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-1">Type: {listingType}</p>
      <StatusBadge
        status={active ? "Active" : closed ? "Closed" : "Inactive"}
      />
      <p className="text-sm text-gray-600 mt-2">
        Applicants: <span className="font-semibold">{applicants.length}</span>
      </p>
      <Link
        to={`/admin/internship/${id}`}
        className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline"
      >
        View Details
      </Link>
    </div>
  );
};

export default AdminInternshipCard;
