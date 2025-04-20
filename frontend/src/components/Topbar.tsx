export default function Topbar() {
    return (
        <div className="w-full md:flex h-16 bg-white flex items-center justify-end px-6 shadow">
            <div className="relative">
                <button className="md:flex items-center space-x-2 focus:outline-none">
                    <img
                        src="https://ui-avatars.com/api/?name=Bima"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="md:flex font-medium text-gray-700">Bima</span>
                </button>
                {/* Dropdown could be added here if needed */}
            </div>
        </div>
    );
}
