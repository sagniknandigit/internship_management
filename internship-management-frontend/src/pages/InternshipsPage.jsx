import React, { useState, useEffect } from "react";
import { getAllInternships } from "../services/internshipService";
import { Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    role: "",
    location: "",
    duration: ""
  });

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const data = await getAllInternships();
        setInternships(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to fetch internships");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  useEffect(() => {
    let temp = internships;

    if (filters.role) {
      temp = temp.filter((i) =>
        i.title.toLowerCase().includes(filters.role.toLowerCase())
      );
    }
    if (filters.location) {
      temp = temp.filter((i) =>
        i.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.duration) {
      temp = temp.filter((i) =>
        i.duration.toLowerCase().includes(filters.duration.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [filters, internships]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Available Internships
      </h1>
      <p className="text-gray-600 mb-6">
        Find your perfect match and kickstart your career with Aninex.
      </p>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          name="role"
          value={filters.role}
          onChange={handleChange}
          placeholder="Filter by Role"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Filter by Location"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="duration"
          value={filters.duration}
          onChange={handleChange}
          placeholder="Filter by Duration"
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600">No internships found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((internship) => (
            <div
              key={internship.id}
              className="flex flex-col justify-between bg-white shadow-md rounded-lg p-6 h-full"
            >
              <div>
                <h2 className="text-xl font-semibold text-indigo-700">
                  {internship.title}
                </h2>
                <p className="text-gray-600 mt-1">{internship.description}</p>
                <div className="mt-4 space-y-1 text-sm text-gray-500">
                  <p>
                    <strong>Location:</strong> {internship.location}
                  </p>
                  <p>
                    <strong>Duration:</strong> {internship.duration}
                  </p>
                  <p>
                    <strong>Stipend:</strong> {internship.stipend}
                  </p>
                  <p>
                    <strong>Apply By:</strong> {internship.applyBy}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to={`/intern/apply/${internship.id}`}
                  className="block w-full text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;
