import mockUsers from "../mock/user.json";

// A helper function to initialize and retrieve the user "database" from localStorage
const getUsersFromStorage = () => {
  const usersInStorage = localStorage.getItem("users");
  if (!usersInStorage) {
    // If no users in storage, initialize with mock data and save it
    localStorage.setItem("users", JSON.stringify(mockUsers));
    return mockUsers;
  }
  return JSON.parse(usersInStorage);
};

// --- REWRITTEN loginUser function ---
export const loginUser = async (email, password) => {
  console.log(`Attempting to log in user: ${email}`);

  // Get the most current list of users from our localStorage "database"
  const users = getUsersFromStorage();

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    console.log("Login successful for:", user.name);
    // Remove password before returning the user object
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: "fake-jwt-token-for-" + user.id,
    };
  } else {
    console.error("Login failed: Invalid credentials");
    throw new Error("Invalid email or password");
  }
};

// --- REWRITTEN registerUser function ---
export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;
  console.log(`Attempting to register user: ${email}`);

  const users = getUsersFromStorage();

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  // Create a new user object
  const newUser = {
    id: `user_${Date.now()}`, // Generate a simple unique ID
    name,
    email,
    password, // Storing password in plain text - ONLY FOR MOCKING
    role,
    profilePictureUrl: null,
  };

  // Add the new user to our list
  const updatedUsers = [...users, newUser];

  // Save the updated list back to localStorage
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  console.log("Registration successful! Updated user database:", updatedUsers);
  return { success: true, message: "User registered successfully!" };
};
