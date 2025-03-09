import { useState, useEffect } from "react";
import axios from "axios";

const HelpRequests = () => {
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        urgency: "Medium"
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [responses, setResponses] = useState([]);
    const [newResponse, setNewResponse] = useState("");


    useEffect(() => {
        axios.get("http://localhost:5000/api/help-requests")
            .then(res => setRequests(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post("http://localhost:5000/api/help-requests", formData, config);
            alert("Help request created!");
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "Error submitting request");
        }
    };




    const handleViewResponses = async (id) => {
        setSelectedRequest(id);
        try {
            const res = await axios.get(`http://localhost:5000/api/help-requests/${id}/responses`);
            setResponses(res.data);
        } catch (error) {
            console.error(error);
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


    return (
        <div className="max-w-3xl mx-auto p-6 bg-teal-200">
            <h1 className="text-3xl font-bold mb-4">Community Help Requests</h1>

            {/* Help Request Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <input type="text" name="title" placeholder="Title" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded mb-2" required></textarea>
                <select name="category" onChange={handleChange} className="w-full p-2 border rounded mb-2" required>
                    <option value="">Select Category</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Food">Food</option>
                    <option value="Shelter">Environment</option>
                    <option value="Other">Other</option>
                </select>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Submit Request</button>
            </form>

            

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
                <div className="mt-6 p-4 border rounded shadow">
                    <h2 className="text-xl font-bold">Responses</h2>
                    {responses.length > 0 ? (
                        <ul>
                            {responses.map(res => (
                                <li key={res.id} className="border-b p-2">
                                    <strong>{res.responder}:</strong> {res.response}
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
    );
};


export default HelpRequests;
