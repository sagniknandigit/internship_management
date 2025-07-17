// src/pages/Admin/AllInternships.jsx

import React, { useState, useEffect, useCallback } from "react";
import InternshipCard from "../../components/admin/AdminInternshipCard";
import Pagination from "../../components/ui/Pagination";
import { getData, saveData } from "../../services/dataService";
import InternshipDetailsModal from "./InternshipDetailsModal";

const AllInternships = () => {
    const [enrichedInternships, setEnrichedInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const internshipsPerPage = 9;

    const loadAndEnrichData = useCallback(() => {
        console.log("--- Starting to load and enrich data ---");
        const baseInternships = getData("internships");
        const stats = getData("internshipStats");
        const applications = getData("applications");

        console.log("Base Internships Loaded:", baseInternships);
        console.log("Stats Loaded:", stats);
        console.log("Applications Loaded:", applications);

        if (!baseInternships || baseInternships.length === 0) {
            console.error("CRITICAL: No base internships were found. Check your internship.json file and dataService.js");
            return;
        }

        const enrichedData = baseInternships.map(internship => {
            const stat = stats.find(s => s.id === internship.id) || {};
            const applicantCount = applications.filter(app => app.internshipId === internship.id).length;

            return {
                ...internship,
                active: stat.active || false,
                closed: stat.closed || false,
                applicantCount,
            };
        });

        console.log("Final Enriched Data:", enrichedData);
        setEnrichedInternships(enrichedData);
    }, []);

    useEffect(() => {
        loadAndEnrichData();
    }, [loadAndEnrichData]);

    const handleViewDetails = (internshipId) => {
        const allUsers = getData("users");
        const allApplications = getData("applications");
        const targetInternship = enrichedInternships.find(i => i.id === internshipId);
        if (!targetInternship) return;
        const applicantIds = allApplications.filter(app => app.internshipId === internshipId).map(app => app.internId);
        const applicantDetails = allUsers.filter(user => applicantIds.includes(user.id));
        setSelectedInternship(targetInternship);
        setApplicants(applicantDetails);
        setIsModalOpen(true);
    };

    const handleEndInternship = (internshipId) => {
        const stats = getData("internshipStats");
        const updatedStats = stats.map(stat => stat.id === internshipId ? { ...stat, active: false, closed: true } : stat);
        saveData("internshipStats", updatedStats);
        loadAndEnrichData();
        setIsModalOpen(false);
    };

    const currentInternships = enrichedInternships.slice((currentPage - 1) * internshipsPerPage, currentPage * internshipsPerPage);
    const totalPages = Math.ceil(enrichedInternships.length / internshipsPerPage);

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">All Internship Listings</h1>
                {currentInternships.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentInternships.map((internship) => (
                                <InternshipCard
                                    key={internship.id}
                                    internship={internship}
                                    onViewDetails={() => handleViewDetails(internship.id)}
                                />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        <p>No internships to display.</p>
                        <p className="text-sm mt-2">Check the browser console (F12) for error messages.</p>
                    </div>
                )}
            </div>

            <InternshipDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                internship={selectedInternship}
                applicants={applicants}
                onEndInternship={handleEndInternship}
            />
        </>
    );
};

export default AllInternships;