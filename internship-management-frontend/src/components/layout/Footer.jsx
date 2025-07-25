import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Aninex Global Services. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;
