const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection
const  authMiddleware = require("./middleware"); // JWT auth middleware


// Dashboard API Route
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.userId;

  // SQL Queries
  const eventsJoinedQuery = "SELECT COUNT(*) AS total FROM event_attendees WHERE user_id = ?";
  const teamsQuery = "SELECT COUNT(*) AS total FROM team_invites WHERE receiver_id = ? AND status = 'accepted'";
  const helpRequestsQuery = "SELECT COUNT(*) AS total FROM help_requests WHERE created_by = ?";
  const upcomingEventsQuery = "SELECT id, title, `date` FROM events ORDER BY date ASC LIMIT 5";

  // Execute queries using existing MySQL connection
  db.query(eventsJoinedQuery, [userId], (err, eventsResult) => {
    if (err) return res.status(500).json({ message: "Error fetching events" });

    db.query(teamsQuery, [userId], (err, teamsResult) => {
      if (err) return res.status(500).json({ message: "Error fetching teams" });

      db.query(helpRequestsQuery, [userId], (err, helpRequestsResult) => {
        if (err) return res.status(500).json({ message: "Error fetching help requests" });

        db.query(upcomingEventsQuery, (err, upcomingEventsResult) => {
          if (err) return res.status(500).json({ message: "Error fetching upcoming events" });

          // Send response with all data
          res.json({
            totalEventsJoined: eventsResult[0].total,
            teamsParticipated: teamsResult[0].total,
            helpRequests: helpRequestsResult[0].total,
            upcomingEvents: upcomingEventsResult,
          });
        });
      });
    });
  });
});

module.exports = router;
