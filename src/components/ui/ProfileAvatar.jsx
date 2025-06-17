import React from "react";

// A helper function to get initials from a name
const getInitials = (name = "") => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("") 
    .toUpperCase();
};

const ProfileAvatar = ({ user, size = "lg" }) => {
  if (!user) return null;

  // --- SOLUTION 1: Map a simple prop to actual Tailwind classes ---
  // This ensures Tailwind's JIT compiler can see the full class names.
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-20 w-20 text-2xl",
  };

  const initials = getInitials(user.name);
  const containerSizeClass = sizeClasses[size] || sizeClasses["lg"];

  return (
    <div className={`relative inline-block ${containerSizeClass}`}>
      {user.profilePictureUrl ? (
        // --- SOLUTION 2: Use a container div to enforce the shape ---
        <div className={`overflow-hidden rounded-full ${containerSizeClass}`}>
          <img
            src={user.profilePictureUrl}
            alt={user.name}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold ${containerSizeClass}`}
        >
          <span>{initials}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
