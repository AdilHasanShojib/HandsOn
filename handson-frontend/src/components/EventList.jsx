import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    const fetchEvents = () => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (date) params.append("date", date);

        axios.get(`http://localhost:5000/api/events?${params.toString()}`)
            .then(res => setEvents(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchEvents();
    }, [search, category, date]);

    const handleJoinEvent = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:5000/api/events/join/${eventId}`, {}, config);
            alert("Successfully joined the event!");
        } catch (error) {
            alert(error.response?.data?.message || "Error joining event");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-indigo-700">Upcoming Events</h1>

            {/* Search and Filter Section */}
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="border p-2 rounded w-full"
                />
                <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="border p-2 rounded"
                >
                    <option value="">All Categories</option>
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Community">Community</option>
                </select>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="border p-2 rounded"
                />
            </div>

            {/* Event List */}
            {events.length === 0 ? (
                <p className="text-gray-500">No events found.</p>
            ) : (
                <div className="space-y-4">
                    {events.map(event => (
                        <div key={event.id} className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
                            <div>
                            <h2 className="text-lg font-semibold cursor-pointer text-indigo-600 hover:underline" onClick={() => navigate(`/events/${event.id}`)}>{event.title}</h2>
                                <p className="text-sm text-gray-600">{event.description}</p>
                                <p className="text-xs text-gray-500">{event.date} at {event.time} | {event.location}</p>
                                <p className="text-sm font-bold text-indigo-500">Category: {event.category}</p>
                            </div>
                            <button 
                                onClick={() => handleJoinEvent(event.id)} 
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Join
                            </button>

                            <button 
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                            >
                            View Details
                           </button>



                        </div>
                    ))}
                </div>
            )}
              

<div className="mt-8 flex justify-center">
  <button 
    onClick={() => navigate("/create-event")}
    className="mt-10 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
    + Create New Event
  </button>
</div>






        </div>
    );
};

export default EventList;
