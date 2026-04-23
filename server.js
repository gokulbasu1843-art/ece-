const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Schema
const studentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    course: String
});

const Student = mongoose.model("Student", studentSchema);

// API
app.post("/register", async (req, res) => {
    const data = new Student(req.body);
    await data.save();
    res.send("Data Saved Successfully");
});
app.get("/students", verifyToken, async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.delete("/delete/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});
app.put("/update/:id", async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.send("Updated");
});
const jwt = require("jsonwebtoken");
const SECRET = "mysecretkey"; // change kar sakta hai
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.send("Access Denied");

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch {
        res.send("Invalid Token");
    }
}

// 🔐 LOGIN API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // simple admin (demo)
    if (username === "admin" && password === "1234") {
        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
        res.json({ token });
    } else {
        res.status(401).send("Invalid login");
    }
});
const path = require("path");
app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});
// Test route
app.get("/", (req, res) => {
    res.send("ECE Server Running 🚀");
});

// Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});