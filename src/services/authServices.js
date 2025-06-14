const mentors = [];
const interns = [];

export const registerUser = (user, role) => {
  if (role === "mentor") {
    mentors.push({ ...user, approved: false });
  } else {
    interns.push(user);
  }
};

export const loginUser = (email, password, role) => {
  const users = role === "mentor" ? mentors : interns;
  const found = users.find(
    (u) => u.email === email && u.password === password
  );
  if (!found) return null;
  if (role === "mentor" && !found.approved) {
    return "not-approved";
  }
  return found;
};
