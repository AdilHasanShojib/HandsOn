import React, { useEffect, useState } from "react";
import { fetchUserInvites, acceptInvite, declineInvite } from "../api";

const TeamInvites = () => {
    const [invites, setInvites] = useState([]);

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
        <div>
            <h2>Team Invites</h2>
            {invites.length > 0 ? (
                invites.map((invite) => (
                    <div key={invite.id} className="border p-2 my-2">
                        <p>You've been invited to join team #{invite.team_id}</p>
                        <button onClick={() => handleAccept(invite.id)} className="bg-green-500 px-2 py-1 mr-2">
                            Accept
                        </button>
                        <button onClick={() => handleDecline(invite.id)} className="bg-red-500 px-2 py-1">
                            Decline
                        </button>
                    </div>
                ))
            ) : (
                <p>No invites available.</p>
            )}
        </div>
    );
};

export default TeamInvites;
