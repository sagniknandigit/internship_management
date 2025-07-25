import allUsers from "../mock/user.json";
import allTasks from "../mock/tasks.json";
import allMeetings from "../mock/meetings.json";
import allConversations from "../mock/conversations.json";
import allApplications from "../mock/applications.json";
import allSharedDocuments from "../mock/sharedDocuments.json";
import mentorAssignments from "../mock/mentorAssignments.json"; //

// Simulate API call delay
const fetchWithDelay = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

//
// ======================== INTERN FUNCTIONS ============================
//

/** Get applications for a given intern ID */
export const getApplicationsByInternId = (internId) => {
  const applications = allApplications.filter(
    (app) => app.internId === internId
  );
  return fetchWithDelay(applications);
};

/** Get tasks assigned to a given intern ID */
export const getTasksByInternId = (internId) => {
  const tasks = allTasks.filter((task) => task.internId === internId);
  return fetchWithDelay(tasks);
};

/** Get meetings scheduled for a given intern ID */
export const getMeetingsByInternId = (internId) => {
  const meetings = allMeetings.filter(
    (meeting) => meeting.internId === internId
  );
  return fetchWithDelay(meetings);
};

// Get shared documents to a given intern ID / uploaded by mentor ID
export const getSharedDocuments = ({ internId, mentorId }) => {
  const allDocs = allSharedDocuments;
  let filteredDocs = [];
  if (internId) {
    filteredDocs = allDocs.filter((doc) => doc.internId === internId);
  } else if (mentorId) {
    filteredDocs = allDocs.filter((doc) => doc.uploadedBy === mentorId);
  }
  return fetchWithDelay(filteredDocs);
};

//
// ======================== MENTOR FUNCTIONS ============================
//

/** Get interns assigned to a mentor */
export const getInternsByMentorId = (mentorId) => {
  const assignedInternIds = mentorAssignments[mentorId] || [];
  if (assignedInternIds.length === 0) return fetchWithDelay([]);

  const assignedInterns = allUsers.filter(
    (user) => user.role === "Intern" && assignedInternIds.includes(user.id)
  );

  return fetchWithDelay(assignedInterns);
};

/** Get tasks submitted by interns assigned to a mentor */
export const getTasksForMentorReview = (mentorId) => {
  const tasksForMentor = allTasks.filter((task) => task.mentorId === mentorId);

  const tasksWithInternInfo = tasksForMentor.map((task) => {
    const intern = allUsers.find((user) => user.id === task.internId);
    return {
      ...task,
      internName: intern ? intern.name : "Unknown Intern",
    };
  });

  return fetchWithDelay(tasksWithInternInfo);
};

/** Get meetings scheduled with interns under a mentor */
export const getMeetingsByMentorId = (mentorId) => {
  const meetingsForMentor = allMeetings.filter(
    (meeting) => meeting.mentorId === mentorId
  );

  const meetingsWithInternInfo = meetingsForMentor.map((meeting) => {
    const intern = allUsers.find((user) => user.id === meeting.internId);
    return {
      ...meeting,
      internName: intern ? intern.name : "Unknown Intern",
    };
  });

  return fetchWithDelay(meetingsWithInternInfo);
};

/** Get chat conversations of interns under a mentor */
export const getConversationsForMentor = (mentorId) => {
  const assignedInternIds = mentorAssignments[mentorId] || [];
  const conversations = {};

  assignedInternIds.forEach((internId) => {
    conversations[internId] = allConversations[internId] || [];
  });

  return fetchWithDelay(conversations);
};

//
// ======================== OPTIONAL EXTENSIONS ============================
//

// Add later if needed:
// export const getApplicationById = (id) => { ... }
// export const submitApplication = (data) => { ... }
// export const getAllInternships = () => { ... }
