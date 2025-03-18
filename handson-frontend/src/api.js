import axios from "axios";

const API_URL = "http://localhost:5000/api/teams"; // Backend API URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}` // Assuming token is stored in localStorage
    }
});

// Fetch all teams (public + user-joined teams)
export const fetchTeams = async () => {
    const response = await api.get(`/`);  
    return response.data;
};
// Create a new team
export const createTeam = async (teamData) => {
    const response = await api.post("/create", teamData);
    return response.data;
};

// Join a team
export const joinTeam = async (team_id) => {
    const response = await api.post("/join", { team_id });
    return response.data;
};

// Leave a team
export const leaveTeam = async (team_id) => {
    const response = await api.post("/leave", { team_id });
    return response.data;
};

// Team Details
export const fetchTeamDetails = async (team_id) => {
    const response = await api.get(`/${team_id}`);
    return response.data;
};

// ✅ Send an invite
export const sendInvite = async (team_id, user_id) => {
    const token = localStorage.getItem("token"); // Ensure token is stored
    const response = await api.post(
        `/${team_id}/invite`,
        { user_id },
        {
            headers: {
                Authorization: `Bearer ${token}`, // Include JWT token
            },
        }
    );
    return response.data;
};
// ✅ Accept invite
export const acceptInvite = async (invite_id) => {
    const response = await api.post(`/invite/accept`, { invite_id });
    return response.data;
};

// ✅ Decline invite
export const declineInvite = async (invite_id) => {
    const response = await api.post(`/invite/decline`, { invite_id });
    return response.data;
};

// ✅ Fetch invites for the logged-in user
export const fetchUserInvites = async () => {
    const response = await api.get(`/invites`);
    return response.data;
};
