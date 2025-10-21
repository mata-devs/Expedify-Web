import React from "react";
import mascot from "../assets/gecko3.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white text-center px-6">
        {children}
      </div>

      {/* Right Section */}
      <div className="hidden md:flex absolute top-0 w-[15%] right-0 h-screen bg-[#202007] bg-expedify-dark items-center justify-center">
        <img
          src={mascot}
          alt="Expedify mascot"
          className="w-[100%] scale-200 object-contain absolute top-[14%] right-[35%]"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
