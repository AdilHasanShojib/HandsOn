import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventDetails = () => {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Fetch event details
        axios.get(`http://localhost:5000/api/events/${eventId}`)
            .then(res => setEvent(res.data))
            .catch(() => alert("Event not found"));

        // Fetch event attendees
        axios.get(`http://localhost:5000/api/events/${eventId}/attendees`)
            .then(res => {
                setAttendees(res.data);
                const userId = localStorage.getItem("userId");
                if (res.data.some(attendee => attendee.id === Number(userId))) {
                    setIsRegistered(true);
                }
            })
            .catch(err => console.error("Error fetching attendees:", err));
    }, [eventId]);

    const handleRSVP = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:5000/api/events/join/${eventId}`, {}, config);
            alert("Successfully registered for the event!");
            setIsRegistered(true);
            
            // Refresh attendee list
            axios.get(`http://localhost:5000/api/events/${eventId}/attendees`)
                .then(res => setAttendees(res.data));
        } catch (error) {
            alert(error.response?.data?.message || "Error joining event");
        }
    };

    if (!event) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-indigo-700">{event.title}</h1>
            <p className="text-gray-600 mt-2">{event.description}</p>
            <p className="text-sm text-gray-500 mt-1">{event.date} at {event.time} | {event.location}</p>
            <p className="text-sm font-bold mt-2">Organizer: {event.organizer}</p>

            <button 
                onClick={handleRSVP} 
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                    isRegistered ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                disabled={isRegistered}
            >
                {isRegistered ? "Already Registered" : "Register for Event"}
            </button>

            <button 
                onClick={() => navigate("/events")} 
                className="ml-2 mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
                Back to Events
            </button>

            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Attendees ({attendees.length})</h2>
                {attendees.length > 0 ? (
                    <ul>
                        {attendees.map(attendee => (
                            <li key={attendee.id} className="p-2 border-b">{attendee.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No attendees yet.</p>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
