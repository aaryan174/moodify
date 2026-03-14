const express = require("express");
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/user.routes")
const songRoutes = require("./routes/songs.routes")
const cors = require("cors")


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);



module.exports = app;