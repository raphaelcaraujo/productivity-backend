const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample Route
app.get("/", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

// Another API Route
app.get("/test", (req, res) => {
    res.json({ message: "Test API working!" });
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
