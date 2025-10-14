import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('./kuu-bgImage.jpg')" }}>
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0  bg-opacity-50"></div>

      {/* Centered content */}
      <div className="relative z-10 w-full max-w-md  sm:p-8 rounded-2xl  ">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
