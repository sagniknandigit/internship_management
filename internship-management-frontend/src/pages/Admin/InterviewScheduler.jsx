import React, { useState, useEffect, useCallback } from "react";
import { getData, saveData } from "../../services/dataService";
import Spinner from "../../components/ui/Spinner";

const InterviewScheduler = () => {
  const [formData, setFormData] = useState({
    selectedInternId: "",
    selectedMentorId: "",
    selectedApplicationId: "", // ID of the application selected for the interview
    interviewLink: "",
    duration: "30", // Default duration in minutes
    date: "", // YYYY-MM-DD format
    startTime: "", // HH:MM format
    instructions: "",
  });

  const [interns, setInterns] = useState([]); // Only interns who have applied
  const [mentors, setMentors] = useState([]);
  const [internApplications, setInternApplications] = useState([]); // Filtered applications for the selected intern
  const [allInternships, setAllInternships] = useState([]); // All internships for title lookup
  const [allApplicationsData, setAllApplicationsData] = useState([]); // All raw applications data
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formatTimeComponent = (comp) => comp.toString().padStart(2, "0");

  const calculateEndTime = useCallback(() => {
    const { date, startTime, duration } = formData;
    if (date && startTime && duration) {
      const meetingDuration = parseInt(duration, 10);

      const startDate = new Date(`${date}T${startTime}:00`);
      startDate.setMinutes(startDate.getMinutes() + meetingDuration);

      const endHours = formatTimeComponent(startDate.getHours());
      const endMinutes = formatTimeComponent(startDate.getMinutes());
      return `${endHours}:${endMinutes}`;
    }
    return "N/A";
  }, [formData]);

  const fetchAllData = useCallback(() => {
    setLoading(true);
    try {
      const usersData = getData("users") || [];
      const applicationsData = getData("applications") || [];
      const internshipsData = getData("internships") || [];
      const meetingsData = getData("meetings") || [];

      const internsWithApplicationsIds = new Set(
        applicationsData.map((app) => app.internId)
      );
      setInterns(
        usersData.filter(
          (user) =>
            user.role === "Intern" && internsWithApplicationsIds.has(user.id)
        )
      );

      setMentors(usersData.filter((user) => user.role === "Mentor"));
      setAllApplicationsData(applicationsData);
      setAllInternships(internshipsData);

      const enrichedMeetings = meetingsData.map((meeting) => {
        const intern = usersData.find((u) => u.id === meeting.participants[0]);
        const mentor = usersData.find((u) => u.id === meeting.mentor);
        const internship = internshipsData.find(
          (i) => i.id === meeting.internshipId
        );

        const meetingStartTime = meeting.time;
        const meetingDuration = parseInt(meeting.duration, 10);
        let calculatedEndTime = "N/A";
        if (meeting.date && meetingStartTime && meetingDuration) {
          const tempDate = new Date(`${meeting.date}T${meetingStartTime}:00`);
          tempDate.setMinutes(tempDate.getMinutes() + meetingDuration);
          calculatedEndTime = `${formatTimeComponent(
            tempDate.getHours()
          )}:${formatTimeComponent(tempDate.getMinutes())}`;
        }

        return {
          ...meeting,
          internName: intern ? intern.name : "Unknown Intern",
          mentorName: mentor ? mentor.name : "Unknown Mentor",
          internshipTitle: internship ? internship.title : "Unknown Title",
          calculatedEndTime: calculatedEndTime,
        };
      });
      setScheduledMeetings(enrichedMeetings);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setErrorMessage("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 3000);
    return () => clearInterval(intervalId);
  }, [fetchAllData]);

  useEffect(() => {
    if (
      formData.selectedInternId &&
      allApplicationsData.length > 0 &&
      allInternships.length > 0
    ) {
      const appsForIntern = allApplicationsData.filter(
        (app) =>
          app.internId === formData.selectedInternId &&
          app.status !== "Rejected"
      );

      const enrichedApps = appsForIntern.map((app) => {
        const internship = allInternships.find(
          (int) => int.id === app.internshipId
        );
        return {
          ...app,
          jobTitle: internship ? internship.title : "Unknown Job Title",
        };
      });

      setInternApplications(enrichedApps);

      const currentSelectionStillValid = enrichedApps.some(
        (app) => app.applicationId === formData.selectedApplicationId
      );
      if (enrichedApps.length === 1) {
        setFormData((prev) => ({
          ...prev,
          selectedApplicationId: enrichedApps[0].applicationId,
        }));
      } else if (!currentSelectionStillValid) {
        setFormData((prev) => ({ ...prev, selectedApplicationId: "" }));
      }
    } else {
      setInternApplications([]);
      setFormData((prev) => ({ ...prev, selectedApplicationId: "" }));
    }
  }, [
    formData.selectedInternId,
    allApplicationsData,
    allInternships,
    formData.selectedApplicationId,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const selectedApp = internApplications.find(
      (app) => app.applicationId === formData.selectedApplicationId
    );
    const jobTitle = selectedApp ? selectedApp.jobTitle : null;
    const internshipId = selectedApp ? selectedApp.internshipId : null;

    if (
      !formData.selectedInternId ||
      !formData.selectedMentorId ||
      !formData.selectedApplicationId ||
      !formData.interviewLink ||
      !formData.duration ||
      !formData.date ||
      !formData.startTime ||
      !jobTitle
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    const endTime = calculateEndTime();

    try {
      const currentMeetings = getData("meetings") || [];
      const newMeeting = {
        id: `meet_${Date.now()}`,
        title: jobTitle,
        participants: [formData.selectedInternId],
        mentor: formData.selectedMentorId,
        date: formData.date,
        time: formData.startTime,
        duration: formData.duration,
        link: formData.interviewLink,
        agenda: formData.instructions || "No specific instructions.",
        internshipId: internshipId,
        status: "Scheduled",
      };

      saveData("meetings", [...currentMeetings, newMeeting]);
      setSuccessMessage("Interview scheduled successfully!");

      setFormData({
        selectedInternId: "",
        selectedMentorId: "",
        selectedApplicationId: "",
        interviewLink: "",
        duration: "30",
        date: "",
        startTime: "",
        instructions: "",
      });

      fetchAllData();
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      setErrorMessage("Failed to schedule interview. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Schedule Interview
      </h1>
      {successMessage && (
        <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Interview Scheduling Form */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Schedule New Interview
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label
                htmlFor="selectedInternId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Select Intern:
              </label>
              <select
                id="selectedInternId"
                name="selectedInternId"
                value={formData.selectedInternId}
                onChange={handleChange}
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">-- Select Intern --</option>
                {interns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="selectedMentorId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Select Mentor:
              </label>
              <select
                id="selectedMentorId"
                name="selectedMentorId"
                value={formData.selectedMentorId}
                onChange={handleChange}
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">-- Select Mentor --</option>
                {mentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="selectedApplicationId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Internship Applied For:
              </label>
              <select
                id="selectedApplicationId"
                name="selectedApplicationId"
                value={formData.selectedApplicationId}
                onChange={handleChange}
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={
                  !formData.selectedInternId || internApplications.length === 0
                }
                required
              >
                <option value="">
                  {formData.selectedInternId
                    ? internApplications.length > 0
                      ? "-- Select Application --"
                      : "No eligible applications for this intern."
                    : "-- Select an Intern first --"}
                </option>
                {internApplications.map((app) => (
                  <option key={app.applicationId} value={app.applicationId}>
                    {app.jobTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="interviewLink"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Interview Link:
              </label>
              <input
                id="interviewLink"
                name="interviewLink"
                type="url"
                value={formData.interviewLink}
                onChange={handleChange}
                placeholder="e.g., https://meet.google.com/xyz"
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="date"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Date:
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="startTime"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Start Time:
              </label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="duration"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Duration (minutes):
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="input-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="endTime"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                End Time:
              </label>
              <input
                id="endTime"
                name="endTime"
                type="text"
                value={calculateEndTime()}
                className="input-field w-full bg-gray-100 cursor-not-allowed focus:ring-0 focus:border-gray-300"
                disabled
              />
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor="instructions"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Instructions (Optional):
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Any specific instructions for the interviewees."
              rows="3"
              className="textarea-field w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
          >
            Schedule Interview
          </button>
        </form>
      </div>

      {/* List of Conducted Interviews */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 max-w-4xl mx-auto">
        {" "}
        {/* Added max-w-4xl mx-auto */}
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          Scheduled Interviews
        </h2>
        {scheduledMeetings.length === 0 ? (
          <p className="text-center text-gray-600 py-4">
            No interviews scheduled yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Intern
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Mentor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scheduledMeetings.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {meeting.internName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {meeting.mentorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {meeting.internshipTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {meeting.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {meeting.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {meeting.duration} mins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {meeting.calculatedEndTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={meeting.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Join
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewScheduler;
