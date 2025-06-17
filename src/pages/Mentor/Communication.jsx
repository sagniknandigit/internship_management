import React from "react";

const Communication = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Intern Communication
      </h1>
      <p className="text-gray-600">
        This page will host the direct messaging platform for communication
        between mentors and interns.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          Recent Conversations (Coming Soon)
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Conversation with Alice Johnson</li>
          <li>Conversation with Charlie Brown</li>
        </ul>
        <div className="mt-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Type your message here..."
          ></textarea>
          <button className="mt-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Communication;
