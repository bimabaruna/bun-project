import { NavLink } from "react-router-dom";
import { useState } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false); // New state for collapsed state


  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Toggle Button (for collapsing) */}
      <button
        onClick={toggleCollapse}
        className={`absolute mt-0 ml-0 top-4 ${
          isCollapsed ? "left-4" : "left-64"
        } bg-gray-800 text-white p-2 rounded-full md:block z-50 transition-all duration-300`} // Adjusted positioning
      >
        {isCollapsed ? (
          <FaChevronRight />
        ) : (
          <FaChevronLeft />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-800 text-white flex flex-col p-9 transition-all duration-300 md:relative md:translate-x-0 ${
          isCollapsed ? "w-0" : "w-64"
        }`} // Use isCollapsed to control width
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-bold transition-opacity duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            Menu
          </h2>
          {/* Remove the hamburger button */}
        </div>
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="products"
            className={({ isActive }) =>
              isActive ? "font-bold text-indigo-400" : "hover:text-indigo-400"
            }
          >
            <span
              className={`transition-opacity duration-300 ${
                isCollapsed ? "opacity-0" : "opacity-100"
              } inline-block`}
            >
              Product List
            </span>
          </NavLink>
          {/* Add more NavLinks here */}
        </nav>
      </div>
    </div>
  );
}
