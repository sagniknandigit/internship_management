import React, { useState, useEffect } from "react";

const ApplicationDetailsModal = ({
  isOpen,
  onClose,
  applicationDetails,
  onStatusChange, // Callback to update status in parent
  statusColors, // Pass statusColors map for consistency
  mentorsList, // NEW: List of available mentors
  onAssignMentor, // NEW: Callback to assign mentor in parent
}) => {
  const [currentModalStatus, setCurrentModalStatus] = useState(
    applicationDetails?.status || "Submitted"
  );
  const [selectedMentor, setSelectedMentor] = useState(
    applicationDetails?.currentAssignedMentorId || ""
  ); // State for selected mentor in modal
  const [modalSuccessMessage, setModalSuccessMessage] = useState("");
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  useEffect(() => {
    if (applicationDetails?.status) {
      setCurrentModalStatus(applicationDetails.status);
    }
    // Set selected mentor when modal opens or applicationDetails change
    if (applicationDetails?.currentAssignedMentorId) {
      setSelectedMentor(applicationDetails.currentAssignedMentorId);
    } else {
      setSelectedMentor(""); // No mentor assigned
    }
  }, [applicationDetails]); // Depend on applicationDetails to re-initialize

  if (!isOpen || !applicationDetails) return null;

  const handleModalStatusChange = (e) => {
    setCurrentModalStatus(e.target.value);
    setModalSuccessMessage("");
    setModalErrorMessage("");
  };

  const handleMentorSelectChange = (e) => {
    setSelectedMentor(e.target.value);
    setModalSuccessMessage("");
    setModalErrorMessage("");
  };

  const handleSubmitStatusChange = () => {
    if (currentModalStatus === applicationDetails.status) {
      setModalErrorMessage("Status is already set to this value.");
      return;
    }
    setModalSuccessMessage("");
    setModalErrorMessage("");

    onStatusChange(applicationDetails.applicationId, currentModalStatus);
    setModalSuccessMessage("Status change submitted. Data refreshed!");
  };

  const handleAssignMentorClick = () => {
    if (!selectedMentor) {
      setModalErrorMessage("Please select a mentor to assign.");
      return;
    }
    if (selectedMentor === applicationDetails.currentAssignedMentorId) {
      setModalErrorMessage("This mentor is already assigned.");
      return;
    }
    setModalSuccessMessage("");
    setModalErrorMessage("");

    onAssignMentor(applicationDetails.internId, selectedMentor); // Pass intern ID and selected mentor ID
    setModalSuccessMessage("Mentor assignment submitted. Data refreshed!");
  };

  const handleDownload = (fileName) => {
    if (fileName) {
      alert(
        `Simulating download of: ${fileName}\n(In a real app, this would trigger a file download)`
      );
    } else {
      setModalErrorMessage("File not available for download.");
    }
  };

  const handleViewInNewTab = (fileName) => {
    if (fileName) {
      alert(
        `Simulating view in new tab for: ${fileName}\n(In a real app, this would open a PDF viewer in a new tab)`
      );
    } else {
      setModalErrorMessage("File not available for viewing.");
    }
  };

  const statusOptions = [
    "Submitted",
    "Under Review",
    "Interview Scheduled",
    "Shortlisted",
    "Hired",
    "Rejected",
  ];

  return (
    <div className="fixed inset-0 bg-gray-900/60 bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in">
        <div className="flex justify-between items-center p-5 border-b border-indigo-100 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-indigo-800">
            Application Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl transition-colors duration-200"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {modalSuccessMessage && (
            <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
              {modalSuccessMessage}
            </div>
          )}
          {modalErrorMessage && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
              {modalErrorMessage}
            </div>
          )}

          {/* Application Summary */}
          <section className="pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-indigo-700 mb-3">
              Internship Applied For:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
              <p>
                <strong>Title:</strong> {applicationDetails.internshipTitle}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {applicationDetails.internshipLocation}
              </p>
              <p>
                <strong>Stipend:</strong> {applicationDetails.internshipStipend}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {applicationDetails.internshipDuration}
              </p>
              <p>
                <strong>Apply By:</strong>{" "}
                {applicationDetails.internshipApplyBy}
              </p>
              <p>
                <strong>Current Status:</strong>
                <span
                  className={`ml-2 px-3 py-1 rounded-full font-semibold text-sm ${
                    statusColors[applicationDetails.status] ||
                    "bg-gray-200 text-gray-700"
                  }`}
                >
                  {applicationDetails.status}
                </span>
              </p>
            </div>
          </section>

          {/* NEW: Assign Mentor Section - Appears only if status is "Hired" */}
          {applicationDetails.status === "Hired" && (
            <section className="pb-4 pt-4 border-t border-gray-100">
              {" "}
              {/* Added border-t for separation */}
              <h4 className="font-bold text-indigo-700 mb-3">Assign Mentor:</h4>
              <div className="flex flex-col sm:flex-row items-end gap-4">
                {" "}
                {/* items-end to align bottom */}
                <div className="flex-1 w-full sm:w-auto">
                  <label
                    htmlFor="mentorAssignSelect"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Select Mentor:
                  </label>
                  <select
                    id="mentorAssignSelect"
                    value={selectedMentor}
                    onChange={handleMentorSelectChange}
                    className="input-field w-full px-3 py-2 text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">-- Select Mentor --</option>
                    {mentorsList.map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-auto">
                  <button
                    onClick={handleAssignMentorClick}
                    disabled={
                      !selectedMentor ||
                      selectedMentor ===
                        applicationDetails.currentAssignedMentorId
                    }
                    className={`py-2 px-4 rounded-md font-semibold text-sm transition-colors duration-200 w-full sm:w-auto ${
                      !selectedMentor ||
                      selectedMentor ===
                        applicationDetails.currentAssignedMentorId
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    Assign Mentor
                  </button>
                </div>
              </div>
              {applicationDetails.currentAssignedMentorName && (
                <p className="text-sm text-gray-600 mt-2">
                  Currently assigned to:{" "}
                  <span className="font-medium">
                    {applicationDetails.currentAssignedMentorName}
                  </span>
                </p>
              )}
            </section>
          )}

          {/* Personal Information */}
          <section className="pb-4 border-b border-gray-100">
            <h4 className="font-bold text-indigo-700 mb-3">
              Personal Information:
            </h4>
            <div className="flex flex-col gap-x-8 gap-y-2">
              <p>
                <strong>Name:</strong> {applicationDetails.firstName}{" "}
                {applicationDetails.middleName} {applicationDetails.lastName}
              </p>
              <p>
                <strong>Email:</strong> {applicationDetails.email}
              </p>
              <p>
                <strong>Address:</strong> {applicationDetails.applicantAddress},{" "}
                {applicationDetails.applicantCity},{" "}
                {applicationDetails.applicantState}
              </p>
            </div>
          </section>

          {/* Academic Details */}
          <section className="pb-4 border-b border-gray-100">
            <h4 className="font-bold text-indigo-700 mb-3">
              Academic Details:
            </h4>
            <div className="flex flex-col gap-x-8 gap-y-2">
              <p>
                <strong>University:</strong> {applicationDetails.university}
              </p>
              <p>
                <strong>Current Year of Study:</strong>{" "}
                {applicationDetails.currentYear}
              </p>
              <p>
                <strong>Expected Passing Year:</strong>{" "}
                {applicationDetails.passingYear}
              </p>
            </div>
          </section>

          {/* Skills and Links */}
          <section className="pb-4 border-b border-gray-100">
            <h4 className="font-bold text-indigo-700 mb-3">
              Skills and Links:
            </h4>
            <div className="flex flex-col gap-x-8 gap-y-2">
              <p>
                <strong>Skills:</strong>{" "}
                {applicationDetails.applicantSkills &&
                applicationDetails.applicantSkills.length > 0
                  ? applicationDetails.applicantSkills.join(", ")
                  : "N/A"}
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <a
                  href={applicationDetails.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {applicationDetails.github || "N/A"}
                </a>
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={applicationDetails.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {applicationDetails.linkedin || "N/A"}
                </a>
              </p>
            </div>
          </section>

          {/* Essay Questions */}
          <section className="pb-4 border-b border-gray-100">
            <h4 className="font-bold text-indigo-700 mb-3">Essay Questions:</h4>
            <div className="flex flex-col gap-y-2">
              <p>
                <strong>Why this internship?:</strong>{" "}
                {applicationDetails.whyInternship}
              </p>
              <p>
                <strong>What do you expect to learn?:</strong>{" "}
                {applicationDetails.expectations}
              </p>
            </div>
          </section>

          {/* Documents */}
          <section className="pb-4">
            <h4 className="font-bold text-indigo-700 mb-3">Documents:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <strong className="text-gray-700">Resume:</strong>
                {applicationDetails.resumeFileName ? (
                  <>
                    <button
                      onClick={() =>
                        handleViewInNewTab(applicationDetails.resumeFileName)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(applicationDetails.resumeFileName)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      Download
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <strong className="text-gray-700">Cover Letter:</strong>
                {applicationDetails.coverLetterFileName ? (
                  <>
                    <button
                      onClick={() =>
                        handleViewInNewTab(
                          applicationDetails.coverLetterFileName
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleDownload(applicationDetails.coverLetterFileName)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      Download
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500">Not provided</span>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Footer with Status Change and Close/Cancel Buttons */}
        <div className="p-5 border-t border-indigo-100 bg-amber-100 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0 z-10">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="statusSelectFooter"
              className="text-gray-700 text-sm font-bold sm:whitespace-nowrap"
            >
              Change Status:
            </label>
            <select
              id="statusSelectFooter"
              value={currentModalStatus}
              onChange={handleModalStatusChange}
              className="input-field px-3 py-2 text-sm bg-white border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={handleSubmitStatusChange}
              disabled={currentModalStatus === applicationDetails.status}
              className={`py-2 px-4 rounded-md font-semibold text-sm transition-colors duration-200 w-full sm:w-auto ${
                currentModalStatus === applicationDetails.status
                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Change Status
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md text-sm transition-colors duration-200 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
