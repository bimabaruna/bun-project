import { NavLink } from "react-router-dom"

export default function Sidebar() {
    return (
        <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-4">
            <h2 className="text-xl font-bold mb-6">Menu</h2>
            <nav className="space-y-4">
                <NavLink
                    to="products"
                    className={({ isActive }) =>
                        isActive
                            ? "font-bold text-indigo-400"
                            : "hover:text-indigo-400"
                    }
                >
                    Product List
                </NavLink>
            </nav>
        </div>
    );
}