import { useState, useRef, useEffect } from "react";
import profile from "../../assets/icons/profile.png";
import logo1 from "../../assets/logo1.png";
import { useExpedifyStore } from "../../utils/useExpedifyStore";
import { logout } from "../../utils/logout";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sample auth state (replace with your real auth logic)
  const {user}=useExpedifyStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center sticky top-0 bg-white z-40 px-4 py-2 shadow-sm">
      {/* LOGO */}
      <a href="/" className="flex items-center">
        <img src={logo1} className="h-10" />
      </a>

      {/* PROFILE DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group"
        >
          <img
            src={profile}
            alt="Profile"
            className="h-8 transition-transform group-hover:scale-110"
          />
        </button>

        {/* DROPDOWN MENU */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden animate-fadeIn">
            
            {!user ? (
              // NOT AUTH
              <a
                href="/signin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Login
              </a>
            ) : (
              // AUTH
              <>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <button
                  onClick={() => logout()}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        )}
      </div>
    </header>
  );
}
