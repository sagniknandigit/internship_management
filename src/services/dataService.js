import initialInternships from "../mock/internship.json";
import initialUsers from "../mock/user.json";
import initialApplications from "../mock/applications.json";
import initialInternshipStats from "../mock/internshipStats.json";
import initialTasks from "../mock/tasks.json";
import initialMentorAssignments from '../mock/mentorAssignments.json';
import initialUpdates from '../mock/updates.json';

const MOCK_DATA_MAP = {
  internships: initialInternships,
  users: initialUsers,
  applications: initialApplications,
  internshipStats: initialInternshipStats,
  tasks: initialTasks,
  mentorAssignments: initialMentorAssignments,
  updates: initialUpdates,
};

/**
 * Initializes data in localStorage from mock files ONLY if it's not already present.
 * This function no longer forces a reload, preserving any changes made in the application.
 */
export const initializeData = () => {
  console.log("Checking and initializing data if not present...");
  try {
    for (const key in MOCK_DATA_MAP) {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(MOCK_DATA_MAP[key]));
        console.log(`Initializing '${key}' because it was not found.`);
      }
    }
    console.log("Data initialization check complete.");
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
};

// The old forceReloadData function is now deprecated by the new logic.
// We are keeping the name here but having it call the new, safer initializer
// to ensure that existing calls to it from AuthContext don't break.
export const forceReloadData = () => {
  initializeData();
};

/**
 * Gets a specific dataset from localStorage. If not found, loads from the mock file.
 * @param {string} key The key for the dataset (e.g., 'internships').
 * @returns {Array} The requested data array.
 */
export const getData = (key) => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      const mockData = MOCK_DATA_MAP[key];
      if (mockData) {
        console.log(`Loading mock data for '${key}' for the first time.`);
        localStorage.setItem(key, JSON.stringify(mockData));
        return mockData;
      }
      return [];
    }
  } catch (error) {
    console.error(`Error getting data for key '${key}':`, error);
    return [];
  }
};

export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key '${key}':`, error);
  }
};