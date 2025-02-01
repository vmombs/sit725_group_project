const { Server } = require("socket.io");

let io;

module.exports = {
  initialize: (server) => {
    io = new Server(server);

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('usernameUpdated', (newUsername) => { // Listen for the usernameUpdated event
        io.emit('usernameUpdated', newUsername); // Re-emit to all clients
        console.log("Username Updated")
      });

      // We have both client side and server side socket emissions. 
      // The client-side emit (found in my-account.js) is triggered only when the client itself receives a usernameUpdated event from the server.
      // This first listener is attached to the client's socket.
      // The second listener, (found here in socketManager.js) is attached to each individual socket that connects to the server.  
      // It's triggered when a client emits a usernameUpdated event to the server.

      socket.on('priceUpdate', (data) => { // Listen for the priceUpdate event
        io.emit('priceUpdate', data); // Re-emit to all connected clients
        console.log("Price Updated")
      });

      // Same explanation above applies to the priceUpdate socket as well

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.IO not initialized. Call initialize(server) first.");
    }
    return io;
  },
};