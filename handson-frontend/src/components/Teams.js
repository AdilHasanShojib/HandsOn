import React, { useEffect, useState } from "react";
import { fetchTeams, createTeam, joinTeam, leaveTeam, sendInvite } from "../api";
import { Link } from "react-router-dom";

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [newTeam, setNewTeam] = useState({ name: "", description: "", is_private: false });
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteTeamId, setInviteTeamId] = useState(null);
    const [inviteUserId, setInviteUserId] = useState("");

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await fetchTeams();
            //console.log("Fetched Teams Data:", data);
            setTeams(data);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            await createTeam(newTeam);
            setNewTeam({ name: "", description: "", is_private: false });
            loadTeams();
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    const handleJoinTeam = async (team_id) => {
        try {
            await joinTeam(team_id);
            loadTeams();
        } catch (error) {
            console.error("Error joining team:", error);
        }
    };

    const handleLeaveTeam = async (team_id) => {
        try {
            await leaveTeam(team_id);
            loadTeams();
        } catch (error) {
            console.error("Error leaving team:", error);
        }
    };

    const openInviteModal = (team_id) => {
        setInviteTeamId(team_id);
        setShowInviteModal(true);
    };

    const handleSendInvite = async () => {
        try {
            await sendInvite(inviteTeamId, inviteUserId);
            setShowInviteModal(false);
            alert("Invite sent successfully!");
        } catch (error) {
            console.error("Error sending invite:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4">Teams</h2>

            <form onSubmit={handleCreateTeam} className="mb-6 p-4 bg-white shadow rounded">
                <input
                    type="text"
                    placeholder="Team Name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="border p-2 w-full mb-2"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="border p-2 w-full mb-2"
                />
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={newTeam.is_private}
                        onChange={(e) => setNewTeam({ ...newTeam, is_private: e.target.checked })}
                        className="mr-2"
                    />
                    Private Team
                </label>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Create Team</button>
            </form>

            <div>
                {teams.length === 0 ? (
                    <p>No teams available</p>
                ) : (
                    teams.map((team) => (
                        <div key={team.id} className="border p-4 mb-4 rounded shadow bg-white flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">{team.name}</h3>
                            <p className="text-gray-700">{team.description}</p>
                            {team.is_private && !team.is_member && (
                                <p className="text-red-500 font-medium">Private Team - Invite Only</p>
                            )}
                        
                        


                        </div>
                    
                        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                            {team.is_member ? (
                                <button onClick={() => handleLeaveTeam(team.id)} className="bg-red-500 text-white px-4 py-1 rounded">
                                    Leave Team
                                </button>
                            ) : (
                                !team.is_private && (
                                    <button onClick={() => handleJoinTeam(team.id)} className="bg-green-500 text-white px-4 py-1 rounded">
                                        Join Team
                                    </button>
                                )
                            )}
                    
                            {team.can_invite && (
                                <button onClick={() => openInviteModal(team.id)} className="bg-blue-500 text-white px-4 py-1 rounded">
                                    Invite Members
                                </button>
                            )}
                    
                            <Link to={`/team/${team.id}`} className="bg-blue-600 text-white px-4 py-1 rounded">
                                View Details
                            </Link>
                        </div>
                    </div>
                    
                    ))
                )}
            </div>

            {showInviteModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Invite User</h2>
                        <input
                            type="text"
                            placeholder="Enter User ID"
                            value={inviteUserId}
                            onChange={(e) => setInviteUserId(e.target.value)}
                            className="border p-2 w-full mb-2"
                        />
                        <button onClick={handleSendInvite} className="bg-green-500 text-white px-4 py-2 rounded">
                            Send Invite
                        </button>
                        <button onClick={() => setShowInviteModal(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teams;
