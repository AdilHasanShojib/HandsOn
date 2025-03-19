import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch User Data
        const userResponse = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data.user);

        // Fetch Dashboard Stats
        const statsResponse = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsResponse.data);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">HandsOn</h1>
        <nav className="space-x-6">
          <a href="/" className="hover:underline">Home</a>
          <a href="/teams" className="hover:underline">Teams</a>
          <a href="/invite" className="hover:underline">Invite</a>
          <a href="/events" className="hover:underline">Events</a>
          <a href="/help-requests" className="hover:underline">Help Requests</a>
        </nav>
        <button 
          onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
         <h2 className="text-5xl font-semibold text-gray-700">
             Welcome, {user ? user.name : "User"}!
          </h2>
       <button
      onClick={() => navigate("/edit-profile")}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition ml-auto">
      Edit Profile
    </button>

      </div>


       <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Events Joined</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {stats ? stats.totalEventsJoined : 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Teams Participated</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {stats ? stats.teamsParticipated : 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Help Requests Created</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {stats ? stats.helpRequests : 0}
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <h3 className="text-xl font-semibold mt-6 text-gray-700">Upcoming Events</h3>
        <div className="mt-4 space-y-4">
          {stats && stats.upcomingEvents.length > 0 ? (
            stats.upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded-lg shadow flex justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700">{event.title}</h4>
                  <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
                </div>
                <button onClick={() => navigate("/events")} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
                  Browse Events
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No upcoming events.</p>
          )}
        </div>

       
      </div>
    </div>
  );
};

export default Dashboard;
