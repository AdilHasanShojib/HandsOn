import React, { useEffect, useState } from "react";
import { fetchTeams, createTeam, joinTeam, leaveTeam } from "../api";
import { Link } from "react-router-dom";

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [newTeam, setNewTeam] = useState({ name: "", description: "", is_private: false });

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await fetchTeams();
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
            loadTeams(); // Refresh teams list
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

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4">Teams</h2>

            {/* Create Team Form */}
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

            {/* Teams List */}
            <div>
                {teams.length === 0 ? (
                    <p>No teams available</p>
                ) : (
                    teams.map((team) => (
                        <div key={team.id} className="border p-4 mb-4 rounded shadow">
                            <h3 className="text-lg font-bold">{team.name}</h3>
                            <p>{team.description}</p>
                            
                            {team.is_member ? (
                                <button onClick={() => handleLeaveTeam(team.id)} className="bg-red-500 text-white px-4 py-1 mt-2 rounded">
                                    Leave Team
                                </button>
                            ) : (
                                <button onClick={() => handleJoinTeam(team.id)} className="bg-green-500 text-white px-4 py-1 mt-2 rounded">
                                    Join Team
                                </button>
                            )}
                            <Link to={`/team/${team.id}`} className="ml-8 bg-blue-600 text-white px-4 py-1 mt-2 rounded">View Details</Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Teams;
