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
        <div className="max-w-3xl mx-auto mt-8 p-4">
            {team ? (
                <>
                    <h2 className="text-2xl font-bold mb-2">{team.name}</h2>
                    <p className="mb-4">{team.description}</p>

                    <h3 className="text-lg font-semibold">Members</h3>
                    <ul className="mb-4">
                        {members.map((member) => (
                            <li key={member.id} className="border p-2 mb-2 rounded">
                                {member.name} - {member.role}
                            </li>
                        ))}
                    </ul>

                  

                    
                </>
            ) : (
                <p>Loading team details...</p>
            )}
        </div>
    );
};

export default TeamDashboard;
