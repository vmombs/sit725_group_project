document.addEventListener("DOMContentLoaded", () => {
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const getForecastButton = document.getElementById("getForecast");
  const forecastContainer = document.getElementById("forecastContainer");
  const errorMessage = document.getElementById("errorMessage");

  // Fetch forecast data from the backend
  async function fetchForecast() {
    const latitude = latitudeInput.value;
    const longitude = longitudeInput.value;

    // Validate inputs
    if (!latitude || !longitude) {
      errorMessage.textContent = "Please enter valid latitude and longitude.";
      forecastContainer.innerHTML = ""; // Clear previous results
      return;
    }

    $.ajax({
      url: `/forecast/api?latitude=${latitude}&longitude=${longitude}`,
      type: 'GET',
      success: (data) => {
        console.log("Frontend Received Data:", data);
        displayForecast(data);
        errorMessage.textContent = ""; // Clear error message
      },
      error: (xhr, status, error) => {
        errorMessage.textContent = "Failed to fetch forecast data.";
        console.error("Error fetching forecast data:", error);
      }
    });
    
  }

  // Display forecast data
  function displayForecast(forecast) {
    // Check for valid forecast data
    if (!forecast || !forecast.dailyInfo || !Array.isArray(forecast.dailyInfo)) {
      forecastContainer.innerHTML = "<p class='red-text'>Invalid forecast data received.</p>";
      return;
    }

    // Generate HTML for the 5-day forecast
    forecastContainer.innerHTML = `
      <h5 class="center-align">5-Day Pollen Forecast</h5>
      <div class="forecast-list">
        ${forecast.dailyInfo.map((day, index) => {
      const date = new Date(day.date.year, day.date.month - 1, day.date.day);
      const pollenTypes = day.pollenTypeInfo.map(pollen => {
        const level = pollen.indexInfo?.category || "Unknown";
        return `<p><strong>${pollen.displayName}:</strong> ${level}</p>`;
      }).join("");

      return `
          <div class="forecast-card">
            <h6>${index === 0 ? "Today" : date.toLocaleDateString('en-US', { weekday: 'long' })}</h6>
            ${pollenTypes}
          </div>
        `;
    }).join("")}
    </div>
  `;
  }

  // Attach event listener to the button
  getForecastButton.addEventListener("click", fetchForecast);
});
