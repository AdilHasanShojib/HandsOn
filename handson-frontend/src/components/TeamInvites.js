import React, { useEffect, useState } from "react";
import { fetchUserInvites, acceptInvite, declineInvite } from "../api";
import { useNavigate } from "react-router-dom";

const TeamInvites = () => {
    const [invites, setInvites] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        loadInvites();
    }, []);

    const loadInvites = async () => {
        try {
            const data = await fetchUserInvites();
            setInvites(data);
        } catch (error) {
            console.error("Error fetching invites:", error);
        }
    };

    const handleAccept = async (invite_id) => {
        await acceptInvite(invite_id);
        loadInvites(); // Refresh invites list
    };

    const handleDecline = async (invite_id) => {
        await declineInvite(invite_id);
        loadInvites();
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-teal-200 shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">Team Invites</h2>
            {invites.length > 0 ? (
                invites.map((invite) => (
                    <div key={invite.id} className="border rounded-lg p-4 my-3 bg-gray-50">
                        <p className="text-gray-700 text-center">
                            You've been invited to join <span className="font-semibold">Team {invite.team_name}</span>
                        </p>
                        <div className="flex justify-center mt-3 space-x-4">
                            <button
                                onClick={() => handleAccept(invite.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleDecline(invite.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No invites available.</p>
            )}
        </div>
       </div>
    </div>
        
    );
};

export default TeamInvites;
