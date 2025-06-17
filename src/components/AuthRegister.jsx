export default function AuthRegister({ role }) {
  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Add register logic, send to authService.js
    if (role === "mentor") {
      alert("Mentor registration sent for admin approval.");
    } else {
      alert("Intern registered successfully!");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border rounded px-4 py-2"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded px-4 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border rounded px-4 py-2"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border rounded px-4 py-2"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        {role === "mentor" ? "Register as Mentor" : "Register as Intern"}
      </button>
    </form>
  );
}
