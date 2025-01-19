$(document).ready(function () {
  $(".modal").modal();
});

document.addEventListener("DOMContentLoaded", function () {
  const modals = document.querySelectorAll(".modal");
  M.Modal.init(modals, {});

  const editUsernameModal = document.getElementById("edit-username-modal");
  const usernameInput = document.getElementById("new_username");
  const editUsernameForm = document.getElementById("edit-username-form");

  const socket = io("http://localhost:3000"); // Establish a connection to a Socket.IO server

  editUsernameForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newUsername = usernameInput.value.trim();

    try {
      const response = await fetch("/auth/edit-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      console.log(data.message);

      // Update username display on the page
      const usernameDisplay = document.querySelector(".card-title strong");
      usernameDisplay.textContent = newUsername;

      // Emit the 'usernameUpdated' event to the server
      socket.emit("usernameUpdated", newUsername);

      // Display success message
      M.toast({ html: "Username updated successfully!", classes: "rounded" });

      // Close the modal
      editUsernameModal.classList.remove("modal-open");
      M.Modal.getInstance(editUsernameModal).close();
    } catch (error) {
      console.error("Error updating username:", error);
      M.toast({
        html: "Error updating username. Please try again.",
        classes: "rounded",
      });
    }
  });

  // Listen for the 'usernameUpdated' event (Not really necessary but just demonstrating the workings of a socket)
  socket.on("usernameUpdated", (newUsername) => {
    const userIdElement = document.getElementById("user-id");
    userIdElement.textContent = newUsername;
  });
});
