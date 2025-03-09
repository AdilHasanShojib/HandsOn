import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import CreateEvent from "./components/CreateEvent";
import HelpRequests from "./components/HelpRequests";

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


      </Routes>
    </Router> 
  );
}

export default App;
