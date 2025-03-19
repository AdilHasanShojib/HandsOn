import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HelpRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
}, []);

const fetchRequests = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/help-requests");
        setRequests(res.data);
    } catch (error) {
        console.error("Error fetching help requests", error);
    }
};

const handleViewResponses = async (requestId) => {
    setSelectedRequest(requestId);
    try {
        const res = await axios.get(`http://localhost:5000/api/help-requests/${requestId}/responses`);
        setResponses(res.data);
    } catch (error) {
        console.error("Error fetching responses", error);
    }
};

const handleSubmitResponse = async () => {
    if (!newResponse.trim()) return alert("Response cannot be empty!");

    try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(`http://localhost:5000/api/help-requests/${selectedRequest}/respond`, { response: newResponse }, config);
        alert("Response submitted!");
        setNewResponse("");
        handleViewResponses(selectedRequest); // Refresh responses
    } catch (error) {
        alert(error.response?.data?.message || "Error submitting response");
    }
};


const handleSendMessage = (responderId, responderName) => {
    navigate(`/message/${selectedRequest}/${responderId}/${responderName}`);
};

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold">HandsOn</h1>
        <nav className="space-x-6">
          <a href="/dashboard" className="font-bold hover:underline">
            Home
          </a>
          <a href="/teams" className="font-bold hover:underline">
            Teams
          </a>
          <a href="/teams-invites" className="font-bold hover:underline">
            Invite
          </a>
          <a href="/events" className="font-bold hover:underline">
            Events
          </a>
          <a href="/help-request" className="font-bold hover:underline">
            Help Requests
          </a>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>
      <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-indigo-700">Community Help Requests</h1>

            {/* List of Help Requests */}
            {requests.map(req => (
                <div key={req.id} className="p-4 border rounded shadow mb-4">
                    <h2 className="text-xl font-bold">{req.title}</h2>
                    <p>{req.description}</p>
                    <p className="text-sm text-gray-600">{req.category} | Urgency: {req.urgency}</p>
                    <p className="text-sm font-bold">Requested by: {req.creator}</p>

                    <button 
                        onClick={() => handleViewResponses(req.id)} 
                        className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                        View Responses
                    </button>
                </div>
            ))}

            {/* Responses Section */}
            {selectedRequest && (
                <div className="bg-teal-200 mt-6 p-4 border rounded shadow">
                    <h2 className="text-xl font-bold">Responses</h2>
                    {responses.length > 0 ? (
                        <ul>
                            {responses.map(res => (
                                <li key={res.id} className="border-b p-2 flex justify-between">
                                    <span>
                                        <strong>{res.responder}:</strong> {res.response}
                                    </span>
                                    <button 
                                        onClick={() => handleSendMessage(res.user_id, res.responder)}
                                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                    >
                                        Message
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No responses yet.</p>
                    )}

                    {/* Response Form */}
                    <textarea
                        className="w-full p-2 border rounded mt-2"
                        placeholder="Write a response..."
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                    ></textarea>
                    <button 
                        onClick={handleSubmitResponse} 
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Submit Response
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default HelpRequests;
