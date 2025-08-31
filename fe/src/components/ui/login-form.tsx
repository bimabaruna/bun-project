import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ username?: string, password?: string }>({});
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null)
        const newErrors: { username?: string, password?: string } = {}

        if (!username) newErrors.username = "Username is required!"
        if (!password) newErrors.password = "Password is required"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setIsLoading(true)
        try {
            const response = await axios.post(`/api/users/login`, { username, password });
            const token = response.data.data.token;
            localStorage.setItem('token', token);

            navigate('/dashboard');
        } catch (err: any) {
            setError('Invalid username or password');
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full space-y-8">
            {/* Logo/Brand */}
            {/* <div className="space-y-2">
                <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">POS</span>
                </div>
            </div> */}

            {/* Form */}
            <div className="space-y-6">
                <h1 className="text-2xl font-normal text-gray-900">Sign in to account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="username" className="text-sm text-gray-600 font-normal">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                if (errors.username) {
                                    setErrors((prev) => ({ ...prev, username: undefined }))
                                }
                            }}
                            className="h-12 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-md"
                            disabled={isLoading}
                        />{
                            errors.username && (
                                <label className="text-sm font-small text-red-500">{errors.username}</label>
                            )
                        }
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-sm text-gray-600 font-normal">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (errors.password) {
                                    setErrors((prev) => ({ ...prev, password: undefined }))
                                }
                            }}
                            className="h-12 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-md"
                            disabled={isLoading}
                        />
                        {
                            errors.password && (
                                <label className="text-sm font-small text-red-500">{errors.password}</label>
                            )}
                    </div>

                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                    <Button
                        type="submit"
                        className="w-full h-12 gradient-primary hover:secondary text-white font-medium rounded-md mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <div className="text-center">
                    <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700"
                        onClick={() => console.log("Forgot password clicked")}
                    >
                        Don't have an account? <span className="text-gray-500 font-medium">Create one here</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
