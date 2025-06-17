import { NavLink } from "react-router-dom";
import { useState } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import { BiStore } from "react-icons/bi";
import { MdOutlineCategory } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleCollapse}
        className={`absolute top-4 transition-all duration-300 bg-gray-800 text-white p-2 rounded-full z-50 ${isCollapsed ? "left-4" : "left-64"
          }`}
      >
        {isCollapsed ? <FaChevronRight className={`transition-transform duration-1000 ${isCollapsed ? "rotate-0" : "rotate-180"
          }`} /> : <FaChevronLeft className={`transition-all duration-1000 overflow-hidden whitespace-nowrap ${isCollapsed ? "rotate-180" : "rotate-0"
            }`} />}
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-500 ${isCollapsed ? "w-16 px-4" : "w-64 p-9"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-bold transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
          >
            Menu
          </h2>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="products"
            title="Product List"
            className={({ isActive }) =>
              `flex items-center gap-3 transition-all duration-300 ${isActive ? "font-bold text-indigo-400" : "hover:text-indigo-400"
              }`
            }
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <AiOutlineProduct
                size={24}
                className={`mt-4 transition-transform duration-500 ${isCollapsed ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>
            <span
              className={`mt-4 transition-all duration-500 overflow-hidden whitespace-nowrap ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
            >
              Product
            </span>
          </NavLink>
          <NavLink
            to="outlets"
            title="Product List"
            className={({ isActive }) =>
              `flex items-center gap-3 transition-all duration-300 ${isActive ? "font-bold text-indigo-400" : "hover:text-indigo-400"
              }`
            }
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <BiStore
                size={24}
                className={`mt-4 transition-transform duration-500 ${isCollapsed ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>
            <span
              className={`mt-4 transition-all duration-500 overflow-hidden whitespace-nowrap ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
            >
              Outlet
            </span>
          </NavLink>
          <NavLink
            to="categories"
            title="Product List"
            className={({ isActive }) =>
              `flex items-center gap-3 transition-all duration-300 ${isActive ? "font-bold text-indigo-400" : "hover:text-indigo-400"
              }`
            }
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <MdOutlineCategory
                size={24}
                className={`mt-4 transition-transform duration-500 ${isCollapsed ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>
            <span
              className={`mt-4 transition-all duration-500 overflow-hidden whitespace-nowrap ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
            >
              Categories
            </span>
          </NavLink>
          <NavLink
            to="categories"
            title="Product List"
            className={({ isActive }) =>
              `flex items-center gap-3 transition-all duration-300 ${isActive ? "font-bold text-indigo-400" : "hover:text-indigo-400"
              }`
            }
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <FaUserCircle
                size={24}
                className={`mt-4 transition-transform duration-500 ${isCollapsed ? "rotate-180" : "rotate-0"
                  }`}
              />
            </div>
            <span
              className={`mt-4 transition-all duration-500 overflow-hidden whitespace-nowrap ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
            >
              Categories
            </span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
