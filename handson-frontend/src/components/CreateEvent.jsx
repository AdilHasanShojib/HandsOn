import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        location: "",
        created_by: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            console.log("Token being sent:", token); // ✅ Debugging
            const userId = localStorage.getItem("userId"); // Fetch userId
            console.log(userId);
            if (!userId) throw new Error("User ID not found.");

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...formData, created_by: Number(userId) }; // Ensure created_by is sent
            console.log("Payload being sent:", payload);

            await axios.post("http://localhost:5000/api/events/create", payload, config);
            alert("Event created successfully!");
            navigate("/events");
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Error creating event");
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

<div className="mt-10 max-w-lg mx-auto p-6 bg-teal-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Create New Event</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="title" placeholder="Event Title" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                <textarea name="description" placeholder="Event Description" onChange={handleChange} className="w-full p-2 border rounded mb-2" required></textarea>

                <input type="date" name="date" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                <input type="time" name="time" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                <input type="text" name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                <select 
                    name="category"
                    onChange={handleChange} 
                    className="w-full p-2 border rounded mb-2"
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Community">Community</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Create Event</button>
            </form>
        </div>


</div>
        
    );
};

export default CreateEvent;
