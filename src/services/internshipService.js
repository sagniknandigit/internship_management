import { getData } from "./dataService"; // Import getData from dataService.js

// Simulate an API call to get all internships
export const getAllInternships = async () => {
  console.log("Fetching all internships...");

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Fetch internships from local storage using getData
  return getData("internships"); // This will now get data from local storage
};

// We will add getInternshipById later
