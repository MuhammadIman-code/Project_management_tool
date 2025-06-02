import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",  // Changed from email to username
    password: ""
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Changed to match backend response (response.data.Token)
      localStorage.setItem("token", response.data.Token);
      navigate("/dashboard");
    } catch (err) {
      // Use the actual error from backend if available
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Account Login
        </h2>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username  {/* Changed from Email to Username */}
            </label>
            <input
              type="text"
              name="username"  
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password field remains the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center text-gray-500 text-xs mt-6">
          &copy; {new Date().getFullYear()} Project Manager. All rights reserved.
        </div>
      </div>
    </div>
  );
}