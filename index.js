const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb+srv://sp511:0000@cluster0.vuedz6a.mongodb.net/studentsDB");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// Add a new student
app.post("/addStudent", async (req, res) => {
  try {
    const { studentName, rollNumber } = req.body;

    if (!studentName) {
      return res.status(400).json({ message: "Student name is required" });
    }

    if (!rollNumber) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const student = new Student({ studentName, rollNumber });
    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error saving student", error });
  }
});

// Update a student
app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, rollNumber } = req.body;
    if (!studentName) {
      return res.status(400).json({ message: "Student name is required" });
    }
    if (!rollNumber) {
      return res.status(400).json({ message: "Roll number is required" });
    }
    const updatedStudent = await Student.findByIdAndUpdate(id, { studentName, rollNumber }, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
});

// Delete a student
app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);
