import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: "",
    causes: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      navigate("/login"); // Redirect to login after successful signup
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-teal-200 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">Full Name</label>
            <input 
              type="text" name="name" placeholder="Adil Hasan" 
              onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input 
              type="email" name="email" placeholder="example@email.com" 
              onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Password</label>
            <input 
              type="password" name="password" placeholder="********" 
              onChange={handleChange} required 
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Skills</label>
            <input 
              type="text" name="skills" placeholder="Teaching, Fundraising, Coding" 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Causes</label>
            <input 
              type="text" name="causes" placeholder="Education, Healthcare, Environment" 
              onChange={handleChange} 
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200" 
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-indigo-600">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

