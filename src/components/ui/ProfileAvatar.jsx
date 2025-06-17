import React from "react";

// A helper function to get initials from a name
const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const ProfileAvatar = ({ user, size = "12" }) => {
  if (!user) return null;

  const initials = getInitials(user.name);
  const sizeClass = `h-${size} w-${size}`;

  return (
    <>
      {user.profilePictureUrl ? (
        <img
          src={user.profilePictureUrl}
          alt={user.name}
          className={`object-cover rounded-full ${sizeClass}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-indigo-500 text-white ${sizeClass}`}
        >
          <span className="text-lg font-bold">{initials}</span>
        </div>
      )}
    </>
  );
};

export default ProfileAvatar;
