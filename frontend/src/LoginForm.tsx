import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{username?: string, password?: string}>({});
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const newErrors : {username?: string, password?: string} = {};

    if(!username) newErrors.username  ="Username is required"
    if(!password) newErrors.password = "Passwword is required"

    if(Object.keys(newErrors).length > 0 ){
      setErrors(newErrors)
      return 
    }

    try {
      const response = await axios.post(
        "/api/users/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data.data.token;
      localStorage.setItem("token", token);
      alert("Login berhasil!");
      navigate("/dashboard");
    } catch (err: any) {
      setError("Login gagal, periksa username atau password!");
    }
  }; // ✅ Ensure the function closes properly

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }
              
              }}
              
            />{errors.username && (
              <label className="text-sm font-small text-red-500">{errors.username}</label>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring focus:ring-indigo-300"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              
              }}
              
            />{errors.password && (
              <label className="text-sm font-small text-red-500">{errors.password}</label>
            )}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
