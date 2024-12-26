const express = require("express");
const path = require("path");
const authRoutes = require("./application/authentication/routes/authRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("passport");
const passportConfig = require("./application/authentication/models/services/passport");
const connectDB = require("./application/db"); // Import the database connection function. Doing it here ensures a single connection accross the entire app.

// Setting up port
const port = process.env.port || 3000;

// Creating express app and configuring middleware
const app = express();

// Connect to MongoDB
connectDB();

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set multiple view directories
app.set("views", [
  path.join(__dirname, "application", "authentication", "views"),
  path.join(__dirname, "application", "user_profile", "views"),
  // ... other view directories for other features such as heat_map etc
]);

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware (required for login to persist accross multiple sessions)
app.use(
  session({
    secret: "your-secret-key", // TO-DO [Replace with a strong, environment-specific secret]
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/sneezlDB",
      // Other options (optional)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // persists for 1 week. can increase but not necessary right now
    },
  })
);

// Passport Authentication initialization
passportConfig(passport); // Initialize Passport with the configuration we defined above
app.use(passport.initialize());
app.use(passport.session());

// Authentication routes
app.use("/auth", authRoutes);
// ... define other routes here

// Middleware to enforce authentication
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.redirect("/auth/login"); 
};

// Apply authentication middleware to all routes
app.use(
  ["/"], 
  ensureAuthenticated // This enforces checking authentication
);

// Static files
app.use(express.static(__dirname + "/public"));

// Start listening at port
const server = app.listen(port, () => {
  console.log("App listening to: " + port);
});

module.exports = server; // Export the server instance [makes using this in unit tests easier]
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.port || 3000;

app.listen(port,()=>{
  console.log("App listening to: "+port)
});
