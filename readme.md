# Student Management Web Application

A simple web application built with Node.js, Express.js, and MongoDB that demonstrates how to display and manage data from a database.

## Lab Manual Project

**Objective:** Use Node.js and Express.js to create a simple web application that displays data from a database.

## Features

- Add students to the database
- Display list of all students
- RESTful API endpoints
- Simple and clean user interface

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### 1. Node.js
Download and install Node.js from:
- **Official Website:** https://nodejs.org/en/download

### 2. MongoDB Server
Choose one of the following installation methods:

- **MongoDB Community Edition (Direct Installation):**  
  https://www.mongodb.com/products/self-managed/community-edition

- **MongoDB with Docker:**  
  https://www.mongodb.com/docs/v7.0/tutorial/install-mongodb-community-with-docker/

### 3. MongoDB Compass
GUI tool to view and manage your databases:
- **MongoDB Compass:** https://www.mongodb.com/products/tools/compass

### 4. Express.js
Will be installed via npm (see installation steps below):
- **Express Documentation:** https://www.npmjs.com/package/express

## Installation Steps

### Step 1: Initialize the Project

Open a terminal in your project folder and run:

```bash
npm init
```

Follow the prompts to create a `package.json` file (you can press Enter to accept defaults).

### Step 2: Install Dependencies

Install the required packages:

```bash
npm install express mongoose nodemon
```

**Package descriptions:**
- `express` - Web framework for Node.js
- `mongoose` - MongoDB object modeling for Node.js
- `nodemon` - Auto-restarts the server on file changes (development tool)

### Step 3: Add Scripts to package.json

Add the following scripts to your `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

### Step 4: Create Project Structure

Create the following folder structure:

```
6_db/
├── models/
│   └── Student.js
├── public/
│   ├── index.html
│   └── styles.css
├── index.js
├── package.json
└── README.md
```

### Step 5: Create the Student Model

Create `models/Student.js`:

```javascript
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
```

### Step 6: Create the Server (index.js)

Create `index.js` with the following server-side code:

```javascript
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
mongoose.connect("mongodb://127.0.0.1:27017/studentDB");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Get all students - GET endpoint
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
});

// Add a new student - POST endpoint
app.post("/addStudent", async (req, res) => {
  try {
    const { studentName } = req.body;
    
    if (!studentName) {
      return res.status(400).json({ message: "Student name is required" });
    }

    const student = new Student({ studentName });
    const savedStudent = await student.save();
    
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error saving student", error });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
```

**Key Components:**
- **Database Connection:** Connects to MongoDB at `mongodb://127.0.0.1:27017/studentDB`
- **GET /students:** Fetches all students from the database
- **POST /addStudent:** Adds a new student to the database
- **Static File Serving:** Serves HTML, CSS, and other files from the `public` directory

### Step 7: Create the Frontend (index.html)

Create `public/index.html` to make API requests from the frontend:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Manager</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>Student Manager</h1>
    
    <div>
      <h2>Add Student</h2>
      <form id="studentForm">
        <label for="studentName">Student Name:</label>
        <input type="text" id="studentName" name="studentName" required />
        <button type="submit">Add Student</button>
      </form>
    </div>

    <div>
      <h2>Students List</h2>
      <ul id="studentsList"></ul>
    </div>

    <script>
      // Load students when page loads
      window.onload = loadStudents;

      // Handle form submission - POST request to add student
      document.getElementById('studentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const studentName = document.getElementById('studentName').value;
        
        try {
          const response = await fetch('/addStudent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentName }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            alert('Student added successfully!');
            document.getElementById('studentForm').reset();
            loadStudents(); // Reload the list
          } else {
            alert('Error: ' + data.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while adding student.');
        }
      });

      // Load students from server - GET request
      async function loadStudents() {
        try {
          const response = await fetch('/students');
          const students = await response.json();
          
          const list = document.getElementById('studentsList');
          list.innerHTML = '';
          
          if (students.length === 0) {
            list.innerHTML = '<li>No students found</li>';
          } else {
            students.forEach(student => {
              const li = document.createElement('li');
              li.textContent = student.studentName;
              list.appendChild(li);
            });
          }
        } catch (error) {
          console.error('Error:', error);
          document.getElementById('studentsList').innerHTML = '<li>Error loading students</li>';
        }
      }
    </script>
  </body>
</html>
```

**Frontend Features:**
- **Form to add students:** Makes a POST request to `/addStudent`
- **Display students list:** Makes a GET request to `/students`
- **Auto-refresh:** Automatically loads students when the page loads

## Running the Application

**For development (with auto-restart):**
```bash
npm run dev
```

**For production:**
```bash
npm start
```

## Access the Application

Open your web browser and navigate to:
```
http://localhost:8000
```

## Testing the Application

1. **Add a Student:**
   - Enter a student name in the form
   - Click "Add Student"
   - The student should appear in the list below

2. **View Students:**
   - All students stored in the database will be displayed in the list
   - Refresh the page to reload the data

3. **Verify in MongoDB Compass:**
   - Open MongoDB Compass
   - Connect to `mongodb://127.0.0.1:27017`
   - Navigate to the `studentDB` database
   - View the `students` collection

## API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/students` | Get all students | None | Array of student objects |
| POST | `/addStudent` | Add a new student | `{ "studentName": "John Doe" }` | Created student object |

## Project Structure

```
6_db/
├── models/
│   └── Student.js          # Mongoose schema for Student
├── public/
│   ├── index.html          # Frontend HTML
│   └── styles.css          # CSS styles
├── index.js                # Express server and API routes
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM (Object Data Modeling)
- **HTML/CSS/JavaScript** - Frontend
