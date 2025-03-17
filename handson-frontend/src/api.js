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
    const response = await api.get("/");
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

export const fetchTeamDetails = async (team_id) => {
    const response = await api.get(`/${team_id}`);
    return response.data;
};