import { useState, useEffect } from "react";
import axios from "axios";

const Messaging = ({ helpRequestId, receiverId, receiverName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchMessages();
    }, [helpRequestId, receiverId]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5000/api/messages/${helpRequestId}/${receiverId}`, config);
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(
                `http://localhost:5000/api/messages/send`,
                { receiver_id: receiverId, help_request_id: helpRequestId, message: newMessage },
                config
            );
            setNewMessage("");
            fetchMessages();
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div className="p-4 border rounded shadow mt-4 bg-white">
            <h2 className="text-lg font-bold">Chat with {receiverName}</h2>
            <div className="h-60 overflow-y-auto border p-2 mt-2">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg.id} className={`p-2 mb-2 ${msg.sender_id === Number(userId) ? "text-right" : "text-left"}`}>
                            <p className="inline-block bg-gray-200 rounded px-3 py-1">
                                <strong>{msg.sender_name}:</strong> {msg.message}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>

            <div className="mt-2 flex">
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                    onClick={handleSendMessage} 
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Messaging;
