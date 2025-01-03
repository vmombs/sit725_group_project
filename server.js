const express = require("express");
const path = require("path");

// Authentication
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./application/authentication/models/services/passport");

// MongoDB
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const connectDB = require("./application/db"); // Import the database connection function. Doing it here ensures a single connection accross the entire app.

// Routes Import
const authRoutes = require("./application/authentication/routes/authRoutes");
const myAccountRoutes = require("./application/my_account/routes/myAccountRoutes");

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
  path.join(__dirname, "application", "my_account", "views"),
  path.join(__dirname, 'application', 'partials'), // Partials directory doesn't have any subdirectories
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

// Mount Routes
app.use("/auth", authRoutes);
app.use("/my_account", myAccountRoutes);
// ... define other routes here

// Middleware to enforce authentication
const ensureAuthenticated = (req, res, next) => {
  if (req.path.startsWith('/js/') || req.path.startsWith('/css/')) {
    return next(); // Allow static files
} 
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
app.use(express.static(path.join(__dirname, 'public')));

// Start listening at port
const server = app.listen(port, () => {
  console.log("App listening to: " + port);
});

module.exports = server; // Export the server instance [makes using this in unit tests easier]
