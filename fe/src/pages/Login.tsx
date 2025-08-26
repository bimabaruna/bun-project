import LoginForm from "@/components/ui/login-form"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Left side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>

            {/* Right side - Geometric Background */}
            <div className="hidden lg:flex flex-center relative overflow-hidden bg-gradient-to-br pos-primary from-blue-600 to-indigo-700">
                {/* Geometric shapes */}
                <div className="absolute inset-0">
                    {/* Large coral circle */}
                    <div className="absolute top-20 right-20 w-32 h-32 bg-coral-400 rounded-full opacity-80"></div>
                    <div className="absolute top-40 right-40 w-24 h-24 bg-coral-300 rounded-full opacity-60"></div>

                    {/* Pink geometric shapes */}
                    <div className="absolute top-32 left-20 w-20 h-20 bg-pink-400 transform rotate-45 opacity-70"></div>
                    <div className="absolute bottom-40 right-32 w-16 h-16 bg-pink-300 transform rotate-12 opacity-60"></div>
                    {/* Dot patterns */}
                    <div className="absolute top-16 left-16 grid grid-cols-3 gap-2">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full opacity-40"></div>
                        ))}
                    </div>
                    <div className="absolute bottom-16 right-16 grid grid-cols-3 gap-2 transform rotate-45">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white rounded-full opacity-40"></div>
                        ))}
                    </div>

                    <div className="absolute bottom-20 left-20 grid grid-cols-4 gap-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-coral-300 rounded-full opacity-60"></div>
                        ))}
                    </div>

                    {/* Triangular shapes */}
                    <div className="absolute bottom-32 left-32 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-pink-400 opacity-70"></div>
                </div>

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-12">
                    {/* Mockup device */}
                    <div className="mb-8 bg-white rounded-lg shadow-2xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                        <div className="w-64 h-40 bg-gray-50 rounded border overflow-hidden">
                            <div className="bg-blue-600 h-8 flex items-center px-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                </div>
                                <div className="ml-4 text-xs text-white">POS Dashboard</div>
                            </div>
                            <div className="p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-600">Today's Sales</div>
                                    <div className="text-sm font-bold text-green-600">$2,450</div>
                                </div>
                                <div className="space-y-1">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                            <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                                            <div className="text-xs text-gray-500">{Math.floor(Math.random() * 100)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Manage Your Business</h2>
                    <p className="text-blue-100 max-w-sm">
                        Access your POS system to track sales, manage inventory, and grow your business efficiently.
                    </p>

                    {/* Navigation dots */}
                    {/* <div className="flex space-x-2 mt-8">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}
