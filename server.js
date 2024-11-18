const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the CORS package
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Enable CORS for all origins (no need to specify the frontend URL)
app.use(cors());

// Middleware
app.use(express.json());

// Hello World Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/api", transactionRoutes);

// Error Handler
app.use(errorHandler);

// Connection to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
