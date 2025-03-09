const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("./middleware"); // Ensure authentication middleware is used

// Create a new help request
router.post("/", authMiddleware, (req, res) => {
    const { title, description, category, urgency } = req.body;
    const created_by = req.user.userId; // Extract user ID from token

    if (!title || !description || !category || !urgency) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sql = `INSERT INTO help_requests (title, description, category, urgency, created_by) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [title, description, category, urgency, created_by], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Help request created successfully!", requestId: result.insertId });
    });
});

// Get all help requests
router.get("/", (req, res) => {
    db.query("SELECT h.*, u.name AS creator FROM help_requests h JOIN users u ON h.created_by = u.id", 
    (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});

// Post a response to a help request
router.post("/:id/respond", authMiddleware, (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Request User:", req.user);

    const { response } = req.body;
    const help_request_id = req.params.id;
    const user_id = req.user?.userId;  // Ensure this exists

    if (!response) {
        return res.status(400).json({ message: "Response cannot be empty." });
    }
    if (!user_id) {
        return res.status(401).json({ message: "User ID missing. Please re-login." });
    }

    const sql = `INSERT INTO help_responses (help_request_id, user_id, response) VALUES (?, ?, ?)`;
    db.query(sql, [help_request_id, user_id, response], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error. Try again later." });
        }
        res.json({ message: "Response submitted successfully!", responseId: result.insertId });
    });
});

// Get responses for a specific help request
router.get("/:id/responses", (req, res) => {
    const sql = `SELECT hr.*, u.name AS responder FROM help_responses hr JOIN users u ON hr.user_id = u.id WHERE hr.help_request_id = ?`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});



// Post a response to a help request
router.post("/:id/respond", authMiddleware, (req, res) => {
    const { response } = req.body;
    const help_request_id = req.params.id;
    console.log(help_request_id);
    const user_id = req.user.userId;
    console.log(user_id);

    if (!response) {
        return res.status(400).json({ message: "Response cannot be empty." });
    }

    const sql = `INSERT INTO help_responses (help_request_id, user_id, response) VALUES (?, ?, ?)`;
    db.query(sql, [help_request_id, user_id, response], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Response submitted successfully!" });
    });
});



// Get responses for a specific help request
router.get("/:id/responses", (req, res) => {
    const sql = `
        SELECT hr.*, u.name AS responder 
        FROM help_responses hr 
        JOIN users u ON hr.user_id = u.id 
        WHERE hr.help_request_id = ? 
        ORDER BY hr.created_at DESC`;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});











module.exports = router;
