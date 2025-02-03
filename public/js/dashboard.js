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

  // MODIFIED: Only modified parts have comments below:
  await $.get("/predictions", (data) => {
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
                <span class="card-title">${severity} ${
          symptomNames[key] || key
        }</span>
              </div>
            </div>
          </div>
        `);
      });
    } else {
      console.error("Failed to get predictions:", data);
    }
  });
});

// $(document).ready(async function () {

//   await $.get("/user", (data) => {
//     if (data.statusCode === 200) {
//       const user = data.user;
//       console.log("User:", user);

//       // add div to #symptoms-list
//       $("#greeting-message").append(`
//         <span class="card-title">
//           <p>Hello,
//             <strong>${user.username}
//               <span id="user-id" style="display: none;">${user.id}</span>
//             </strong>
//           </p>
//         </span>
//         `);
//     } else {
//       console.error("Failed to get user data:", data);
//     }
//   });

//   const medicationNames = {};

//   await $.get("/medications/all", (data) => {
//     if (data) {
//       data.forEach((medication) => {
//         medicationNames[medication.key] = medication.name;
//       });
//     } else {
//       console.error("Failed to get medications:", data);
//     }
//   });

//   await $.get('/predictions', (data) => {

//     if (data.statusCode === 200) {
//       // handle medications
//       const medicationPredictionData = data.data.medications;

//       Object.entries(medicationPredictionData).forEach(([key, value]) => {
//         const medicationNames = {
//           azelastine: "Azelastine (Astepro)",
//           ketotifen: "Ketotifen (Alaway, Zaditor)",
//           olopatadine: "Olopatadine (Pataday)",
//           cetirizine: "Cetirizine (Zyrtec Allergy)",
//           loratadine: "Loratadine (Alavert, Claritin)",
//           fexofenadine: "Fexofenadine (Allegra Allergy)",
//           desloratadine: "Desloratadine (Clarinex)",
//           mometasone: "Mometasone (Nasonex)",
//           fluticasone: "Fluticasone propionate (Flonase Allergy Relief)",
//           ciclesonide: "Ciclesonide (Zetonna)",
//           loteprednol: "Loteprednol (Alrex, Lotemax)",
//           prednisolone_1: "Prednisolone (Omnipred, Pred Forte, others)",
//           prednisolone_2: "Prednisolone (Prelone)",
//           methylprednisolone: "Methylprednisolone (Medrol)",
//         }

//         let image = '';

//         if (String(key).toLowerCase().includes('azelastine')) image = 'astepro.jpg';
//         else if (String(key).toLowerCase().includes('ketotifen')) image = 'alaway.jpg';
//         else if (String(key).toLowerCase().includes('cetirizine')) image = 'zyrtec.jpg';
//         else if (String(key).toLowerCase().includes('loratadine')) image = 'claritin.jpg';
//         else if (String(key).toLowerCase().includes('fexofenadine')) image = 'allegra.jpg';
//         else if (String(key).toLowerCase().includes('desloratadine')) image = 'clarinex.jpg';
//         else if (String(key).toLowerCase().includes('mometasone')) image = 'nasonex.jpg';
//         else if (String(key).toLowerCase().includes('fluticasone')) image = 'flonase.jpg';
//         else if (String(key).toLowerCase().includes('ciclesonide')) image = 'zetonna.jpg';
//         else if (String(key).toLowerCase().includes('loteprednol')) image = 'lotemax.jpg';
//         else if (String(key).toLowerCase().includes('prednisolone_1')) image = 'omnipred.jpg';
//         else if (String(key).toLowerCase().includes('prednisolone_2')) image = 'prelone.jpg';
//         else if (String(key).toLowerCase().includes('methylprednisolone')) image = 'medrol.jpg';
//         else image = 'unknown.jpg';

//         // add div to #medications-list
//         $('#medications-list').append(`
//           <div class="col s4">
//             <div class="card">
//               <div class="card-image">
//                 <img src="assets/images/medications/${image}" alt="Card Background">
//                 <span class="card-title">${value}x ${medicationNames[key]}</span>
//               </div>
//             </div>
//           </div>
//         `);

//       });

//       // hande symptoms
//       const symptomPredictionData = data.data.symptoms;

//       Object.entries(symptomPredictionData).forEach(([key, value]) => {
//         const symptomNames = {
//           congestion: "Congestion",
//           watery_eyes: "Watery Eyes",
//           itchy_eyes: "Itchy Eyes",
//           sinus_pressure: "Sinus Pressure",
//           sneezing: "Sneezing"
//         }

//         let image = '';
//         if (String(key).toLowerCase().includes('congestion')) image = 'congestion.jpg';
//         else if (String(key).toLowerCase().includes('watery_eyes')) image = 'watery-eyes.jpg';
//         else if (String(key).toLowerCase().includes('itchy_eyes')) image = 'itchy-eyes.jpg';
//         else if (String(key).toLowerCase().includes('sinus_pressure')) image = 'sinus-pressure.jpg';
//         else if (String(key).toLowerCase().includes('sneezing')) image = 'sneezing.jpg';
//         else image = 'general-malaise.jpg';

//         let severity = '';
//         if (value == 1) severity = 'Mild';
//         else if (value == 2) severity = 'Moderate';
//         else if (value == 3) severity = 'Severe';
//         else severity = 'Unknown';

//         // add div to #symptoms-list
//         $('#symptoms-list').append(`
//           <div class="col s4">
//             <div class="card">
//               <div class="card-image">
//                 <img src="assets/images/symptoms/${image}" alt="Card Background">
//                 <span class="card-title">${severity} ${symptomNames[key]}</span>
//               </div>
//             </div>
//           </div>
//         `);
//       });

//     } else {
//       console.error('Failed to get predictions:', data);
//     }

//   });

// });
