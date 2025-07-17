import React from "react";
import {
  IoClose,
  IoLocationOutline,
  IoCashOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const InternshipDetailsModal = ({
  isOpen,
  onClose,
  internship,
  applicants,
  onEndInternship,
}) => {
  if (!isOpen || !internship) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {internship.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <IoClose size={28} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Internship Details
            </h3>
            <p className="text-md font-semibold text-indigo-600">
              {internship.company}
            </p>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <IoLocationOutline className="mr-2" /> {internship.location}
              </div>
              <div className="flex items-center">
                <IoCashOutline className="mr-2" /> {internship.stipend}
              </div>
              <div className="flex items-center">
                <IoTimeOutline className="mr-2" /> {internship.duration}
              </div>
              <div className="flex items-center">
                <IoCalendarOutline className="mr-2" /> Apply by:{" "}
                {internship.applyBy}
              </div>
            </div>
            <p className="text-sm text-gray-700 pt-2">
              {internship.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center">
              <IoPeopleOutline className="mr-2" /> Applicants (
              {applicants.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="bg-gray-50 p-3 rounded-md border"
                  >
                    <p className="font-semibold text-gray-800">
                      {applicant.name}
                    </p>
                    <p className="text-sm text-gray-500">{applicant.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No applicants yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={() => onEndInternship(internship.id)}
            disabled={internship.closed}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {internship.closed ? "Internship Ended" : "End Internship"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailsModal;
