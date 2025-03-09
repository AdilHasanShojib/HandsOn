import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);
    return (
      <div className="min-h-screen bg-gray-100">
    <header className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">HandsOn Dashboard</h1>
        <button 
          onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>
  
        <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-5xl font-semibold text-gray-700">Welcome, {user ? user.name : "User"}!</h2>
          
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Total Events Joined</h3>
              <p className="text-2xl font-bold text-indigo-600">12</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Volunteer Hours</h3>
              <p className="text-2xl font-bold text-indigo-600">50 hrs</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Teams Participated</h3>
              <p className="text-2xl font-bold text-indigo-600">3</p>
            </div>
          </div>
  
          <h3 className="text-xl font-semibold mt-6 text-gray-700">Upcoming Events</h3>
          <div className="mt-4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow flex justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-700">Beach Cleanup Drive</h4>
                <p className="text-sm text-gray-500">Date: March 15, 2025</p>
              </div>
              <button onClick={() => navigate("/events")} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
               Browse Events</button>
            </div>

            






          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  