$(document).ready(async function () {

  // NEW: These variables are new (check explanations next to each)
  const medicationData = {}; // variable to store data from the pharmacy_medications collection in mongodb
  const socket = io("http://localhost:3000"); // connection to the web socket instance

  // NEW: Web Socket connection. Setup and initialisation is in the socketManager.js file
  socket.on("connect", () => {
    console.log("Client connected to the server");
  });

  // NEW: log message when there is a connection error
  socket.on("connect_error", (err) => {
    console.error("WebSocket Connection Error:", err);
  });

  // NEW: Web Socket listner for price updates
  socket.on("priceUpdate", (data) => {
    console.log("Received price update:", data);
    const { medicationName, price } = data;

    const medicationPriceElement = document.querySelector(
      `.medication-price[data-medication-name="${medicationName}"]`
    );

    if (medicationPriceElement) {
      medicationPriceElement.textContent = Number(price).toFixed(2);
      console.log("Price:", medicationPriceElement.textContent);
    } else {
      console.log("Element not found!");
    }

    updateTotalPrice(); // This function is called to update the total price when one of the prices changes
  });

  // NEW: function to calculate the total price. The code should be self-explanatory
  function updateTotalPrice() {
    let totalPrice = 0;
    const medicationElements = document.querySelectorAll(".medication-item");
    medicationElements.forEach((medicationElement) => {
      const priceElement = medicationElement.querySelector(".medication-price");
      const price = parseFloat(priceElement.textContent);

      if (!isNaN(price)) {
        totalPrice += price;
      }
    });

    const totalPriceElement = document.getElementById("total-price");
    if (totalPriceElement) {
      totalPriceElement.textContent = totalPrice.toFixed(2);
    }
  }

  // UNCHANGED: Function to get the user from the DB remains unchanged
  await $.get("/user", (data) => {
    if (data.statusCode === 200) {
      const user = data.user;
      console.log("User:", user);

      $("#greeting-message").append(`
        <span class="card-title">
          <p>Hello,
            <strong>${user.username}
              <span id="user-id" style="display: none;">${user.id}</span>
            </strong>
          </p>
        </span>
        `);
    } else {
      console.error("Failed to get user data:", data);
    }
  });

  // NEW: Function to get all the data from the pharmacy_medications collection in mongodb
  // This data is stored in the medicationData variable from line 4 above
  // Note that in the db, we have a medicationName field which is being used as the key here 
  // This makes it work seamlessly with other parts of the code that have not been changed
  await $.get("/medications/all", (data) => {
    if (data) {
      data.forEach((medication) => {
        medicationData[medication.medicationName] = {
          displayName: medication.displayName,
          price: medication.price,
          image: medication.image,
        };
      });
      console.log(`Pharmacy Medications:`, medicationData);
    } else {
      console.error("Failed to get medications:", data);
    }
  });

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    console.log("got position")
    try {
      const response = await fetch('/predictions', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude })
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        const medicationPredictionData = data.data.medications;

        // UNMODIFIED: This part is still getting the ${value} from the preditions data and the ${key} remains the same
        Object.entries(medicationPredictionData).forEach(([key, value]) => {

          // MODIFIED: We're now getting all the medications data from the db and it's stored in the pharmacy_medications collection
          // here we're usisng they ${key} from the medicationPredictionData to look up the relevant data in the medicationData array
          const medication = medicationData[key] || {
            displayName: "Unknown",
            price: "Unknown",
            image: "unknown.jpg",
          };

          // MODIFIED: This part has been modified as follows
          // 1. Added a field to display the ${price}
          // 2. Added identifiers to two elements (medication-item, medication-price). We need these to be able to query and update each item
          // 3. changed the source of the image name so that the image name is taken from the db data rather than in the local variable
          // Most other code is unchanged
          $("#medications-list").append(`
          <div class="col s4 medication-item">
            <div class="card">
              <div class="card-image">
                <img src="assets/images/medications/${medication.image}" alt="Card Background">
                <span class="card-title">${value}x ${medication.displayName} [$<span class="medication-price" data-medication-name="${key}">${medication.price.toFixed(2)}</span>]</span>
              </div>
            </div>
          </div>
        `);

          // NEW: added function to update price
          updateTotalPrice(); // Here, this function is called to update the total price when the page initialy loads
        });

        // UNCHANGED: This part of the code all the way to the bottom remains unchanged
        const symptomPredictionData = data.data.symptoms;
        Object.entries(symptomPredictionData).forEach(([key, value]) => {
          const symptomNames = {
            congestion: "Congestion",
            watery_eyes: "Watery Eyes",
            itchy_eyes: "Itchy Eyes",
            sinus_pressure: "Sinus Pressure",
            sneezing: "Sneezing",
          };

          let image = `${key.replace(/_/g, "-")}.jpg`;
          let severity =
            ["Unknown", "Mild", "Moderate", "Severe"][value] || "Unknown";

          $("#symptoms-list").append(`
          <div class="col s4">
            <div class="card">
              <div class="card-image">
                <img src="assets/images/symptoms/${image}" alt="Card Background">
                <span class="card-title">${severity} ${symptomNames[key] || key
            }</span>
              </div>
            </div>
          </div>
        `);
        });
      } else {
        console.error("Failed to get predictions:", data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
