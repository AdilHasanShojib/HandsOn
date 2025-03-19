import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    skills: "",
    causes: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          name: response.data.user.name,
          email: response.data.user.email,
          skills: response.data.user.skills || "",
          causes: response.data.user.causes || "",
          password: "", // Password is not pre-filled for security reasons
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold">HandsOn</h1>
        <nav className="space-x-6">
        <a href="/dashboard" className="font-bold hover:underline">Home</a>
       <a href="/teams" className="font-bold hover:underline">Teams</a>
       <a href="/teams-invites" className="font-bold hover:underline">Invite</a>
       <a href="/events" className="font-bold hover:underline">Events</a>
       <a href="/help-request" className="font-bold hover:underline">Help Requests</a>

        </nav>
        <button 
          onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-teal-200 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-600">Skills</label>
            <input
              type="text"
              name="skills"
              value={userData.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600">Causes</label>
            <input
              type="text"
              name="causes"
              value={userData.causes}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-gray-600">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
   </div>




  );
};

export default EditProfile;

