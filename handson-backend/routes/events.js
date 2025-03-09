const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection
const  authMiddleware = require("./middleware"); // JWT auth middleware

// Create Event
router.post("/create", authMiddleware, (req, res) => {
    console.log("User from token:", req.user); 
    const { title, description, date, time, location, category } = req.body;
    const created_by = req.user.userId;// Logged-in user

    console.log("Type of created_by:", typeof created_by);

    if (!title || !description || !date || !time || !location || !category) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sql = `
        INSERT INTO events (title, description, date, time, location, category, created_by, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

    db.query(sql, [title, description, date, time, location, category, created_by], (err, result) => {
        if (err) {
            console.error("Database Insert Error:", err); // ✅ Log errors
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Event created successfully!", eventId: result.insertId });
    });
});

// Get All Events
// router.get("/", (req, res) => {
//     const sql = "SELECT e.*, u.name AS organizer FROM events e JOIN users u ON e.created_by = u.id ORDER BY e.date ASC";
//     db.query(sql, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(results);
//     });
// });


router.get("/", (req, res) => {
    const { search, category, date } = req.query;
    let sql = "SELECT e.*, u.name AS organizer FROM events e JOIN users u ON e.created_by = u.id WHERE 1";

    const params = [];
    
    if (search) {
        sql += " AND (e.title LIKE ? OR e.description LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        sql += " AND e.category = ?";
        params.push(category);
    }

    if (date) {
        sql += " AND e.date = ?";
        params.push(date);
    }

    sql += " ORDER BY e.date ASC";

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// Get details of a specific event
router.get("/:id", (req, res) => {
    const eventId = req.params.id;

    const sql = `
        SELECT e.*, u.name AS organizer 
        FROM events e 
        JOIN users u ON e.created_by = u.id 
        WHERE e.id = ?`;

    db.query(sql, [eventId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(result[0]);
    });
});





// Join an Event
router.post("/join/:eventId", authMiddleware, (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.userId;

    console.log(`Event ID: ${eventId}, User ID: ${userId}`);

    // Check if user already joined
    const checkSql = "SELECT * FROM event_attendees WHERE event_id = ? AND user_id = ?";
    db.query(checkSql, [eventId, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            return res.status(400).json({ message: "You have already joined this event!" });
        }

        // Insert participation record
        const joinSql = "INSERT INTO event_attendees (event_id, user_id) VALUES (?, ?)";
        db.query(joinSql, [eventId, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Successfully joined the event!" });
        });
    });
});

// Get Attendees for an Event
router.get("/:eventId/attendees", (req, res) => {
    const { eventId } = req.params;

    const sql = `
        SELECT users.id, users.name, users.email 
        FROM event_attendees 
        JOIN users ON event_attendees.user_id = users.id 
        WHERE event_attendees.event_id = ?`;

    db.query(sql, [eventId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// Remove an attendee from an event (Only event organizer can remove)
router.delete("/:eventId/remove/:userId", authMiddleware, (req, res) => {
    const { eventId, userId } = req.params;
    const organizerId = req.user.userId; // Get logged-in user ID

    // Check if the logged-in user is the event organizer
    const checkOrganizerQuery = "SELECT created_by FROM events WHERE id = ?";
    db.query(checkOrganizerQuery, [eventId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Event not found" });
        
        if (results[0].created_by !== organizerId) {
            return res.status(403).json({ message: "Unauthorized: Only event organizers can remove attendees" });
        }

        // Remove the attendee from the event_attendees table
        const deleteQuery = "DELETE FROM event_attendees WHERE event_id = ? AND user_id = ?";
        db.query(deleteQuery, [eventId, userId], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Attendee removed successfully!" });
        });
    });
});






module.exports = router;
