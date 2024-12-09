const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

// Import routes and database configuration
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const connection = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "https://host-1-5nwp.onrender.com", // Replace with your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", employeeRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Quick Job API server!",
    availableEndpoints: [
      { method: "POST", endpoint: "/api/register", description: "Register a new user" },
      { method: "POST", endpoint: "/api/login", description: "Log in a user" },
      { method: "GET", endpoint: "/api/jobs", description: "Retrieve job listings" },
      { method: "POST", endpoint: "/api/jobs", description: "Create a new job" },
      { method: "GET", endpoint: "/api/applications", description: "Fetch job applications" },
      { method: "POST", endpoint: "/api/payment", description: "Process a payment" },
    ],
  });
});

// Example additional route for resume data
app.post("/api/resume", (req, res) => {
  const {
    firstName,
    lastName,
    address,
    jobTitle,
    linkedinId,
    experience,
    education,
    skills,
  } = req.body;

  const query = `
    INSERT INTO resumes (first_name, last_name, address, job_title, linkedin_id, experience, education, skills)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [
      firstName,
      lastName,
      address,
      jobTitle,
      linkedinId,
      JSON.stringify(experience),
      JSON.stringify(education),
      JSON.stringify(skills),
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving resume data:", err);
        return res.status(500).send("Error saving resume data");
      }
      res.status(201).send({
        message: "Resume saved successfully!",
        resumeId: result.insertId,
      });
    }
  );
});

// Example additional route for experience data
app.post("/api/experience", (req, res) => {
  const { company, position, startDate, endDate, isCurrent, userId } = req.body;

  const query = `
    INSERT INTO experience (user_id, company, position, start_date, end_date, is_current)
    VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [userId, company, position, startDate, endDate, isCurrent ? 1 : 0],
    (err, result) => {
      if (err) {
        console.error("Error saving experience data:", err);
        return res.status(500).send("Error saving experience data");
      }
      res.status(200).send({
        message: "Experience data saved successfully",
        experienceId: result.insertId,
      });
    }
  );
});

// Payment Route
app.post("/api/payment", (req, res) => {
  const { fullName, email, phone, cardName, cardNumber, cvv } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{9}$/;
  const cardNumberRegex = /^\d{16}$/;
  const cvvRegex = /^\d{3}$/;

  if (!fullName || !email || !phone || !cardName || !cardNumber || !cvv) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!phoneRegex.test(phone)) {
    return res
      .status(400)
      .json({ error: "Phone number must be exactly 9 digits and numeric" });
  }
  if (!cardNumberRegex.test(cardNumber)) {
    return res
      .status(400)
      .json({ error: "Credit card number must be exactly 16 digits and numeric" });
  }
  if (!cvvRegex.test(cvv)) {
    return res.status(400).json({ error: "CVV must be exactly 3 digits" });
  }

  const query = `
    INSERT INTO payments (full_name, email, phone, card_name, card_number, cvv)
    VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [fullName, email, phone, cardName, cardNumber, cvv],
    (err, result) => {
      if (err) {
        console.error("Error processing payment:", err);
        return res.status(500).json({ error: "Error processing payment" });
      }
      res.status(201).json({
        message: "Payment processed successfully!",
        paymentId: result.insertId,
      });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
