import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Messaging = () => {
  const { helpRequestId, receiverId, receiverName } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, [helpRequestId, receiverId]);

  const fetchMessages = async () => {
    if (!helpRequestId || !receiverId) {
      console.error("helpRequestId or receiverId is missing");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(
        `http://localhost:5000/api/messages/${helpRequestId}/${receiverId}`,
        config
      );
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        `http://localhost:5000/api/messages/send`,
        {
          receiver_id: receiverId,
          help_request_id: helpRequestId,
          message: newMessage,
        },
        config
      );
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error sending message", error);
    }
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
      <div className="p-4 border rounded shadow mt-4 bg-teal-200">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Chat with {receiverName}</h2>
        <div className="h-60 overflow-y-auto border p-2 mt-2">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 mb-2 ${
                  msg.sender_id === Number(userId) ? "text-right" : "text-left"
                }`}
              >
                <p
                  className={`inline-block rounded px-3 py-1 ${
                    msg.sender_id === Number(userId)
                      ? "bg-blue-200"
                      : "bg-gray-200"
                  }`}
                >
                  <strong>
                    {msg.sender_id === Number(userId) ? "You" : msg.sender_name}
                    :
                  </strong>{" "}
                  {msg.message}
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
    </div>
  );
};

export default Messaging;
