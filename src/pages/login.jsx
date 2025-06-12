import { useState } from "react";
import AuthLogin from "../components/AuthLogin";
import AuthRegister from "../components/AuthRegister";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("intern");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Register Account" : "Login to Your Account"}
        </h2>

        <div className="flex items-center justify-center space-x-6 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value="intern"
              checked={role === "intern"}
              onChange={(e) => setRole(e.target.value)}
              className="accent-indigo-600"
            />
            <span>Intern</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="role"
              value="mentor"
              checked={role === "mentor"}
              onChange={(e) => setRole(e.target.value)}
              className="accent-indigo-600"
            />
            <span>Mentor</span>
          </label>
        </div>

        {isRegister ? <AuthRegister role={role} /> : <AuthLogin role={role} />}

        <p className="text-center mt-4 text-sm">
          {isRegister ? "Already have an account?" : "New here?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 ml-1 underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
