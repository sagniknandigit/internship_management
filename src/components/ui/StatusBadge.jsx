import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    // For Interns
    'Active': 'bg-green-100 text-green-800',
    'Completed': 'bg-blue-100 text-blue-800',
    
    // For Tasks
    'Pending Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Needs Revision': 'bg-red-100 text-red-800',
  };

  const style = statusStyles[status] || 'bg-red-100 text-red-800';

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;