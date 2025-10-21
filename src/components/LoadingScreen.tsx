import React from "react";
import logo from "../assets/logo.png";

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white animate-fade-in">
      <img
        src={logo}
        alt="Expedify logo"
        className="w-40 h-auto animate-pulse mb-2"
      /> 
    </div>
  );
};

export default LoadingScreen;
