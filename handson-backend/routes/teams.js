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

//✅ Get All Teams (Public Teams + Teams User Joined)
// router.get("/", authMiddleware, (req, res) => {
//     const user_id = req.user.userId;
//     const sql = `
//         SELECT t.*, 
//                CASE WHEN tm.user_id IS NOT NULL THEN true ELSE false END AS is_member 
//         FROM teams t 
//         LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.user_id = ?
//         WHERE t.is_private = FALSE OR tm.user_id IS NOT NULL
//         ORDER BY t.created_at DESC;     `;

//     db.query(sql, [user_id], (err, results) => {
//          if (err) return res.status(500).json({ error: err.message });
//          res.json(results);
//      });
//  });



// ✅ Get All Teams (Public + Private but joinable by invite)
router.get("/", authMiddleware, (req, res) => {
    const user_id = req.user.userId;
    const sql = `
        SELECT t.id, 
               t.name, 
               t.description, 
               t.is_private, 
               t.created_by,
               CASE WHEN tm.user_id IS NOT NULL THEN 1 ELSE 0 END AS is_member,
               CASE WHEN t.is_private = TRUE AND t.created_by = ? THEN 1 ELSE 0 END AS can_invite,
               (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) AS members_count
        FROM teams t 
        LEFT JOIN team_members tm ON t.id = tm.team_id AND tm.user_id = ?
        ORDER BY t.created_at DESC;    
    `;

    db.query(sql, [user_id, user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // ✅ Convert 1/0 values to Boolean and hide '0' member counts
        const formattedResults = results.map(team => ({
            ...team,
            is_member: team.is_member === 1,
            is_private: team.is_private === 1,
            can_invite: team.can_invite === 1,
            members_count: team.members_count > 0 ? team.members_count : null // Hide 0 members
        }));

        res.json(formattedResults);
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


// ✅ Send an invite to a user (only by team owner or existing member)
router.post("/:team_id/invite", authMiddleware, (req, res) => {
    console.log("Invite API called", req.body, req.user); 
    const { team_id } = req.params;
    const { user_id, email } = req.body; // The user being invited
    const sender_id = req.user.userId; // The person sending the invite

    if (!sender_id) return res.status(403).json({ error: "Unauthorized request" });

    // Check if the team exists & is private
    const teamCheckQuery = `SELECT is_private FROM teams WHERE id = ?`;
    db.query(teamCheckQuery, [team_id], (err, teamResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (teamResult.length === 0) return res.status(404).json({ error: "Team not found" });
        if (!teamResult[0].is_private) return res.status(400).json({ error: "This team is public, no invite needed." });

        // Check if the sender is a member of the team
        const memberCheckQuery = `SELECT * FROM team_members WHERE team_id = ? AND user_id = ?`;
        db.query(memberCheckQuery, [team_id, sender_id], (err, memberResult) => {
            if (err) return res.status(500).json({ error: err.message });
            if (memberResult.length === 0) return res.status(403).json({ error: "Only team members can send invites." });
            
            // Function to process the invite after resolving user_id
            const processInvite = (receiver_id) => {
                if (!receiver_id) return res.status(400).json({ error: "Invalid user ID or email." });
                
                // Check if an invite already exists
                const inviteExistsQuery = `SELECT * FROM team_invites WHERE team_id = ? AND receiver_id = ? AND status = 'pending'`;
                db.query(inviteExistsQuery, [team_id, receiver_id], (err, inviteResult) => {
                    if (err) return res.status(500).json({ error: err.message });
                    if (inviteResult.length > 0) return res.status(400).json({ error: "Invite already sent to this user." });
                    
                    // Insert invite into the "team_invites" table
                    const inviteQuery = `INSERT INTO team_invites (team_id, sender_id, receiver_id, status) VALUES (?, ?, ?, 'pending')`;
                    db.query(inviteQuery, [team_id, sender_id, receiver_id], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Invite sent successfully!" });
                    });
                });
            };
            
            // If email is provided, find user_id first
            if (email) {
                const emailQuery = `SELECT id FROM users WHERE email = ?`;
                db.query(emailQuery, [email], (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    if (result.length === 0) return res.status(404).json({ error: "User not found" });
                    processInvite(result[0].id);
                });
            } else {
                processInvite(user_id);
            }
        });
    });
});


// ✅ Accept invite & join private team
router.post("/invite/accept", authMiddleware, (req, res) => {
    const { invite_id } = req.body;
    const user_id = req.user.userId;

    // Get team ID from invite
    const getInviteQuery = `SELECT team_id FROM team_invites WHERE id = ? AND receiver_id = ? AND status = 'pending'`;
    db.query(getInviteQuery, [invite_id, user_id], (err, inviteResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (inviteResult.length === 0) return res.status(404).json({ error: "Invalid or expired invite." });

        const team_id = inviteResult[0].team_id;

        // Add user to team
        const joinTeamQuery = `INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, 'member')`;
        db.query(joinTeamQuery, [team_id, user_id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Update invite status
            const updateInviteQuery = `UPDATE team_invites SET status = 'accepted' WHERE id = ?`;
            db.query(updateInviteQuery, [invite_id]);

            res.json({ message: "You have joined the team!" });
        });
    });
});

// ✅ Decline invite
router.post("/invite/decline", authMiddleware, (req, res) => {
    const { invite_id } = req.body;
    const user_id = req.user.userId;

    const declineQuery = `UPDATE team_invites SET status = 'declined' WHERE id = ? AND receiver_id = ?`;
    db.query(declineQuery, [invite_id, user_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Invite declined." });
    });
});













module.exports = router;
