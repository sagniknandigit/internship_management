export default function AuthLogin({ role }) {
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in as", role);
  };

  return (
    <form className="space-y-4" onSubmit={handleLogin}>
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
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Login
      </button>
    </form>
  );
}
