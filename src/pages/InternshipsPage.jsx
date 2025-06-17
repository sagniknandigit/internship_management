import React, { useState, useEffect } from "react";
import { getAllInternships } from "../services/internshipService";
import InternshipCard from "../components/ui/InternshipCard";
import Spinner from "../components/ui/Spinner";

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const data = await getAllInternships();
        setInternships(data);
      } catch (err) {
        setError("Failed to load internships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Available Internships
      </h1>
      <p className="text-gray-600 mb-8">
        Find your perfect match and kickstart your career with Aninex.
      </p>

      {/* Placeholder for Search and Filter controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <p className="text-gray-500">
          Search and filter controls will go here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {internships.length > 0 ? (
          internships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))
        ) : (
          <p className="text-center col-span-full">
            No internships available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default InternshipsPage;
