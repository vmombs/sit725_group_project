const express = require("express");

// Creating express app and configuring middleware below
const app = express();

const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

global.io = io; // Make socket.io available globally

io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit an event to update the username to all connected clients
  socket.on('usernameUpdated', (newUsername) => {
    io.emit('usernameUpdated', newUsername); 
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const path = require("path");

// Authentication
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./application/authentication/models/services/passport");

// MongoDB
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const connectDB = require("./application/db"); // Import the database connection function. Doing it here ensures a single connection accross the entire app.

// CORS
const cors = require("cors");

// Routes Import
const authRoutes = require("./application/authentication/routes/authRoutes");
const dashboardRoutes = require("./application/dashboard/routes/dashboardRoutes");
const myAccountRoutes = require("./application/my_account/routes/myAccountRoutes");
const diaryRoutes = require("./application/diary/routes/diaryRoutes");
const heatmapRoutes = require("./application/heatmap/routes/heatmapRoutes");
const forecastRoutes = require("./application/forecast/routes/forecastRoutes");

// Setting up port
const port = process.env.port || 3000;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set multiple view directories
app.set("views", [
  path.join(__dirname, "application", "authentication", "views"),
  path.join(__dirname, "application", "dashboard", "views"),
  path.join(__dirname, "application", "my_account", "views"),
  path.join(__dirname, 'application', 'partials'), // Partials directory doesn't have any subdirectories
  path.join(__dirname, "application", "diary", "views"),
  path.join(__dirname, "application", "heatmap", "views"),
  path.join(__dirname, "application", "forecast", "views"),
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

// Middleware to enforce authentication
const ensureAuthenticated = (req, res, next) => {
  if (req.path.startsWith('/js/') || req.path.startsWith('/css/') || req.path.startsWith('/assets/')) {
    return next(); // Allow static files
} 
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.redirect("/auth/login"); 
};

// Mount Routes
app.use("/auth", authRoutes);
app.use("/", ensureAuthenticated, dashboardRoutes);
app.use("/my_account", ensureAuthenticated, myAccountRoutes);
app.use("/diary", ensureAuthenticated,  diaryRoutes);
app.use("/heatmap", ensureAuthenticated, heatmapRoutes);
app.use("/forecast", ensureAuthenticated, forecastRoutes);

// Apply authentication middleware to protect the root path
app.use(
  ["/"], 
  ensureAuthenticated // This enforces checking authentication
);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start listening at port
server.listen(port, () => {
  // console.log("App listening to: " + port);
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = server; // Export the server instance [makes using this in unit tests easier]
