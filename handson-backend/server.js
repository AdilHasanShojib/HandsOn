const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");
const authRoutes = require("./routes/auth");
const helpRequestsRoutes = require("./routes/helpRequests");
const messagesRoutes = require("./routes/messages");
const teamRoutes = require("./routes/teams");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // Allows JSON data in requests

app.get("/", (req, res) => {
  res.send("HandsOn API is running...");
});

app.use("/api/help-requests", helpRequestsRoutes); 



app.use("/api/messages", messagesRoutes);
app.use("/api/teams", teamRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/events", require("./routes/events"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));