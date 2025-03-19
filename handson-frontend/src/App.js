import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import CreateEvent from "./components/CreateEvent";
import HelpRequests from "./components/HelpRequests";
import Messaging from "./components/Messaging";
import Teams from "./components/Teams";
import TeamDashboard from "./components/TeamDashboard";
import TeamInvites from "./components/TeamInvites";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/help-request" element={<HelpRequests />} />
        <Route path="/message/:helpRequestId/:receiverId/:receiverName" element={<Messaging />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/team/:team_id" element={<TeamDashboard />} />
        <Route path="/teams-invites" element={<TeamInvites />} />


      </Routes>
    </Router> 
  );
}

export default App;
