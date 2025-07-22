import { getData, saveData } from "./dataService"; // Ensure getData and saveData are imported

export const login = async (email, password) => {
  console.log("Attempting login...");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const users = getData("users"); // Get users from local storage
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // --- START: Added logic for Suspend role check ---
    if (user.role === "Suspend") {
      console.log(`Login failed: User ${user.email} is suspended.`);
      throw new Error(
        "Your account has been suspended. Please contact administrator."
      );
    }
    // --- END: Added logic for Suspend role check ---

    localStorage.setItem("currentUser", JSON.stringify(user));
    console.log("Login successful:", user);
    return user;
  } else {
    console.log("Login failed: Invalid credentials.");
    throw new Error("Invalid email or password.");
  }
};

export const logout = () => {
  localStorage.removeItem("currentUser");
  console.log("User logged out.");
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing current user from localStorage", error);
    return null;
  }
};

export const register = async (userData) => {
  console.log("Attempting registration...");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

  const users = getData("users");
  if (users.some((u) => u.email === userData.email)) {
    throw new Error("User with this email already exists.");
  }

  // Assign default role (e.g., Intern) for new registrations
  const newUser = { ...userData, id: `user_${Date.now()}`, role: "Intern" };
  saveData("users", [...users, newUser]);
  console.log("Registration successful:", newUser);
  return newUser;
};
