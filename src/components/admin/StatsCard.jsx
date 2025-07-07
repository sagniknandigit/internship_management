import React from "react";

const StatsCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{label}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && <Icon className="w-8 h-8 text-gray-400" />}
      </div>
    </div>
  );
};

export default StatsCard;
