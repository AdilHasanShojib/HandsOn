import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTeamDetails, leaveTeam } from "../api";

const TeamDashboard = () => {
  const { team_id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadTeamDetails();
  }, []);

  const loadTeamDetails = async () => {
    try {
      const data = await fetchTeamDetails(team_id);
      setTeam(data.team);
      setMembers(data.members);
    } catch (error) {
      console.error("Error loading team:", error);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(team_id);
      navigate("/teams"); // Redirect to teams list
    } catch (error) {
      console.error("Error leaving team:", error);
    }
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
      
    <div className="max-w-3xl mx-auto mt-8 p-4">
      {team ? (
        <>
          <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
          <p className="mb-4">{team.description}</p>

          <h3 className="text-lg font-semibold">Members</h3>
          {members.length > 0 ? (
            <ul className="mb-4">
              {members.map((member) => (
                <li key={member.id} className="border p-2 mb-2 rounded">
                  {member.name} - {member.role}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No Members</p>
          )}
        </>
      ) : (
        <p>Loading team details...</p>
      )}
    </div>
    </div>



  );
};

export default TeamDashboard;
