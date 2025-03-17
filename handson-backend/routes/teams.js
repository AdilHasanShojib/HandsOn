const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("./middleware");

// ✅ Create a New Team
router.post("/create", authMiddleware, (req, res) => {
    const { name, description, is_private } = req.body;
    const created_by = req.user.userId; // Logged-in user ID

    if (!name.trim()) {
        return res.status(400).json({ message: "Team name is required." });
    }

    const sql = `INSERT INTO teams (name, description, is_private, created_by) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, description, is_private, created_by], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Team created successfully!", team_id: result.insertId });
    });
});

// ✅ Join a Team
router.post("/join", authMiddleware, (req, res) => {
    const { team_id } = req.body;
    const user_id = req.user.userId;

    if (!team_id) return res.status(400).json({ message: "Team ID is required." });

    // Check if team exists
    db.query(`SELECT * FROM teams WHERE id = ?`, [team_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Team not found." });

        // Add user to the team
        const sql = `INSERT INTO team_members (team_id, user_id) VALUES (?, ?)`;
        db.query(sql, [team_id, user_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Successfully joined the team!" });
        });
    });
});

// ✅ Leave a Team
router.post("/leave", authMiddleware, (req, res) => {
    const { team_id } = req.body;
    const user_id = req.user.userId;

    if (!team_id) return res.status(400).json({ message: "Team ID is required." });

    const sql = `DELETE FROM team_members WHERE team_id = ? AND user_id = ?`;
    db.query(sql, [team_id, user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Not a team member." });
        res.json({ message: "Successfully left the team." });
    });
});

// ✅ Get All Teams (Public Teams + Teams User Joined)
router.get("/", authMiddleware, (req, res) => {
    const user_id = req.user.userId;
    const sql = `
        SELECT t.*, 
               CASE WHEN tm.user_id IS NOT NULL THEN true ELSE false END AS is_member 
        FROM teams t 
        LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.user_id = ?
        WHERE t.is_private = FALSE OR tm.user_id IS NOT NULL
        ORDER BY t.created_at DESC;     `;

    db.query(sql, [user_id], (err, results) => {
         if (err) return res.status(500).json({ error: err.message });
         res.json(results);
     });
 });

// // ✅ Get Team Members

router.get("/:team_id/members", authMiddleware, (req, res) => {
    const { team_id } = req.params;

    const sql = `
        SELECT u.id, u.name, tm.role, tm.joined_at 
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = ?
        ORDER BY tm.joined_at ASC;
    `;

    db.query(sql, [team_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// ✅ Get Team Details & Members
router.get("/:team_id", authMiddleware, (req, res) => {
    const { team_id } = req.params;

    const teamQuery = `SELECT id, name, description, is_private FROM teams WHERE id = ?`;
    const membersQuery = `
        SELECT u.id, u.name, tm.role, tm.joined_at 
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = ?
        ORDER BY tm.joined_at ASC;
    `;

    db.query(teamQuery, [team_id], (err, teamResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (teamResult.length === 0) return res.status(404).json({ error: "Team not found" });

        db.query(membersQuery, [team_id], (err, membersResult) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                team: teamResult[0], 
                members: membersResult
            });
        });
    });
});


module.exports = router;
