$(document).ready(function () {
  $(".modal").modal(); // Initialize all modals
});

document.addEventListener("DOMContentLoaded", function () {
  const editUsernameModal = document.getElementById("edit-username-modal");
  const usernameInput = document.getElementById("new_username");
  const editUsernameForm = document.getElementById("edit-username-form");
  const userIdElement = document.getElementById("user-id");

  const socket = io(); // No need to specify URL if on the same domain

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

      const usernameDisplay = document.querySelector(".card-title strong");
      usernameDisplay.textContent = newUsername;

      socket.emit("usernameUpdated", newUsername);

      M.toast({ html: "Username updated successfully!", classes: "rounded" });

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

  socket.on("usernameUpdated", (newUsername) => {
    userIdElement.textContent = newUsername;
  });

  const medicationsTableBody = document.getElementById('medications-table-body');

  $.get('/medications/all', (data) => {
    if (data) {
      const medications = data;
      medications.forEach(medication => {
        const row = `
          <tr>
            <td>${medication.medicationName}</td>
            <td>${medication.displayName}</td>
            <td>$<span class="medication-price" data-medication-name="${medication.medicationName}">${medication.price.toFixed(2)}</span></td>
            <td>
              <button class="waves-effect waves-light btn btn-small update-price-btn" 
                      data-medication-name="${medication.medicationName}"
                      style="background-color: #446732; color: white;">
                Update Price
              </button>
            </td>
          </tr>
        `;
        medicationsTableBody.innerHTML += row; // Or tableBody.append(row);
      });

      medicationsTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('update-price-btn')) {
          const medicationName = event.target.dataset.medicationName;

          $('#edit-price-modal').modal('open');
          $('#medication-name-display').text(medicationName);

          $('#save-price-button').off('click').on('click', function () {
            const newPrice = $('#new_price').val();

            if (newPrice === "" || isNaN(newPrice) || newPrice < 0) {
              M.toast({ html: "Please enter a valid price.", classes: "rounded" });
              return;
            }

            $.ajax({
              url: '/medications/updatePrice',
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ medicationName: medicationName, price: newPrice }),
              success: function (data) {
                $('#edit-price-modal').modal('close');
                $('#new_price').val('');
                M.toast({ html: "Price updated successfully!", classes: "rounded" });
                socket.emit('priceUpdate', { medicationName: medicationName, price: newPrice }); // Emit the event
              },
              error: function (error) {
                console.error('Error updating price:', error);
                M.toast({ html: "Error updating price. Please try again.", classes: "rounded" });
              }
            });
          });
        }
      });
    } else {
      console.error('Failed to get medications:', data);
    }
  });

  socket.on('priceUpdate', (data) => {
    const { medicationName, price } = data;
    const medicationPriceElement = document.querySelector(`.medication-price[data-medication-name="${medicationName}"]`);
    if (medicationPriceElement) {
      medicationPriceElement.textContent = Number(price).toFixed(2);
    }
  });
});