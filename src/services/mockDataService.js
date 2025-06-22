import allUsers from "../mock/user.json";
import allTasks from "../mock/tasks.json";
import allMeetings from "../mock/meetings.json";
import allConversations from "../mock/conversations.json";

const mentorAssignments = {
  mentor01: ["intern01", "intern02", "intern03"],
  mentor02: ["intern04", "intern06"],
  mentor03: ["intern05", "intern07", "intern09"],
};

const fetchWithDelay = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// --- USER-RELATED FUNCTIONS ---

export const getInternsByMentorId = (mentorId) => {
  const assignedInternIds = mentorAssignments[mentorId] || [];
  if (assignedInternIds.length === 0) return fetchWithDelay([]);

  const assignedInterns = allUsers.filter(
    (user) => user.role === "Intern" && assignedInternIds.includes(user.id)
  );

  return fetchWithDelay(assignedInterns);
};

// --- TASK-RELATED FUNCTIONS ---

export const getTasksForMentorReview = (mentorId) => {
  const tasksForMentor = allTasks.filter((task) => task.mentorId === mentorId);

  // Join intern data with task data (like a database JOIN)
  const tasksWithInternInfo = tasksForMentor.map((task) => {
    const intern = allUsers.find((user) => user.id === task.internId);
    return {
      ...task,
      internName: intern ? intern.name : "Unknown Intern",
    };
  });

  return fetchWithDelay(tasksWithInternInfo);
};

// --- MEETING-RELATED FUNCTIONS ---

export const getMeetingsByMentorId = (mentorId) => {
  const meetingsForMentor = allMeetings.filter(
    (meeting) => meeting.mentorId === mentorId
  );

  // Join intern data with meeting data
  const meetingsWithInternInfo = meetingsForMentor.map((meeting) => {
    const intern = allUsers.find((user) => user.id === meeting.internId);
    return {
      ...meeting,
      internName: intern ? intern.name : "Unknown Intern",
    };
  });

  return fetchWithDelay(meetingsWithInternInfo);
};

// --- CHAT-RELATED FUNCTIONS ---

export const getConversationsForMentor = (mentorId) => {
  const assignedInternIds = mentorAssignments[mentorId] || [];
  const conversations = {};
  assignedInternIds.forEach((internId) => {
    conversations[internId] = allConversations[internId] || [];
  });
  return fetchWithDelay(conversations);
};
