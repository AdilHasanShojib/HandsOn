const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("./middleware");

// Send a message
router.post("/send", authMiddleware, (req, res) => {
    const { receiver_id, help_request_id, message } = req.body;
    const sender_id = req.user.userId;

    if (!receiver_id || !help_request_id || !message.trim()) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sql = `INSERT INTO messages (sender_id, receiver_id, help_request_id, message) VALUES (?, ?, ?, ?)`;
    db.query(sql, [sender_id, receiver_id, help_request_id, message], (err) => {
        if (err) {
            console.error("Database error:", err); // 🔹 Add this to check for SQL errors
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Message sent successfully!" });
    });
});

// Get messages between two users for a specific help requestrouter.get("/:help_request_id/:receiver_id", authMiddleware, (req, res) => {
  
    router.get("/:help_request_id/:receiver_id", authMiddleware, (req, res) => {
        const sender_id = req.user.userId; // Logged-in user
        const { help_request_id, receiver_id } = req.params; // Other user
    
        const sql = `
            SELECT m.*, 
                   sender.name AS sender_name, 
                   receiver.name AS receiver_name 
            FROM messages m 
            JOIN users sender ON m.sender_id = sender.id 
            JOIN users receiver ON m.receiver_id = receiver.id 
            WHERE (
                (m.sender_id = ? AND m.receiver_id = ?) 
                OR 
                (m.sender_id = ? AND m.receiver_id = ?)
            ) 
            AND m.help_request_id = ? 
            ORDER BY m.timestamp ASC`;
    
        db.query(sql, [sender_id, receiver_id, receiver_id, sender_id, help_request_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
    
            console.log("Fetched Messages:", results); // Debugging log
            res.json(results);
        });
    });
    

module.exports = router;
