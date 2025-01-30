$(document).ready(async function () {

  await $.get("/user", (data) => {
    if (data.statusCode === 200) {
      const user = data.user;
      console.log("User:", user);

      // add div to #symptoms-list
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

  await $.get('/predictions', (data) => {

    if (data.statusCode === 200) {
      // handle medications
      const medicationPredictionData = data.data.medications;

      Object.entries(medicationPredictionData).forEach(([key, value]) => {
        const medicationNames = {
          azelastine: "Azelastine (Astepro)",
          ketotifen: "Ketotifen (Alaway, Zaditor)",
          olopatadine: "Olopatadine (Pataday)",
          cetirizine: "Cetirizine (Zyrtec Allergy)",
          loratadine: "Loratadine (Alavert, Claritin)",
          fexofenadine: "Fexofenadine (Allegra Allergy)",
          desloratadine: "Desloratadine (Clarinex)",
          mometasone: "Mometasone (Nasonex)",
          fluticasone: "Fluticasone propionate (Flonase Allergy Relief)",
          ciclesonide: "Ciclesonide (Zetonna)",
          loteprednol: "Loteprednol (Alrex, Lotemax)",
          prednisolone_1: "Prednisolone (Omnipred, Pred Forte, others)",
          prednisolone_2: "Prednisolone (Prelone)",
          methylprednisolone: "Methylprednisolone (Medrol)",
        }

        let image = '';

        if (String(key).toLowerCase().includes('azelastine')) image = 'astepro.jpg';
        else if (String(key).toLowerCase().includes('ketotifen')) image = 'alaway.jpg';
        else if (String(key).toLowerCase().includes('cetirizine')) image = 'zyrtec.jpg';
        else if (String(key).toLowerCase().includes('loratadine')) image = 'claritin.jpg';
        else if (String(key).toLowerCase().includes('fexofenadine')) image = 'allegra.jpg';
        else if (String(key).toLowerCase().includes('desloratadine')) image = 'clarinex.jpg';
        else if (String(key).toLowerCase().includes('mometasone')) image = 'nasonex.jpg';
        else if (String(key).toLowerCase().includes('fluticasone')) image = 'flonase.jpg';
        else if (String(key).toLowerCase().includes('ciclesonide')) image = 'zetonna.jpg';
        else if (String(key).toLowerCase().includes('loteprednol')) image = 'lotemax.jpg';
        else if (String(key).toLowerCase().includes('prednisolone_1')) image = 'omnipred.jpg';
        else if (String(key).toLowerCase().includes('prednisolone_2')) image = 'prelone.jpg';
        else if (String(key).toLowerCase().includes('methylprednisolone')) image = 'medrol.jpg';
        else image = 'unknown.jpg';

        // add div to #medications-list
        $('#medications-list').append(`
          <div class="col s4">
            <div class="card">
              <div class="card-image">
                <img src="assets/images/medications/${image}" alt="Card Background">
                <span class="card-title">${value}x ${medicationNames[key]}</span>
              </div>
            </div>
          </div>
        `);

      });

      // hande symptoms
      const symptomPredictionData = data.data.symptoms;

      Object.entries(symptomPredictionData).forEach(([key, value]) => {
        const symptomNames = {
          congestion: "Congestion",
          watery_eyes: "Watery Eyes",
          itchy_eyes: "Itchy Eyes",
          sinus_pressure: "Sinus Pressure",
          sneezing: "Sneezing"
        }

        let image = '';
        if (String(key).toLowerCase().includes('congestion')) image = 'congestion.jpg';
        else if (String(key).toLowerCase().includes('watery_eyes')) image = 'watery-eyes.jpg';
        else if (String(key).toLowerCase().includes('itchy_eyes')) image = 'itchy-eyes.jpg';
        else if (String(key).toLowerCase().includes('sinus_pressure')) image = 'sinus-pressure.jpg';
        else if (String(key).toLowerCase().includes('sneezing')) image = 'sneezing.jpg';
        else image = 'general-malaise.jpg';

        let severity = '';
        if (value == 1) severity = 'Mild';
        else if (value == 2) severity = 'Moderate';
        else if (value == 3) severity = 'Severe';
        else severity = 'Unknown';

        // add div to #symptoms-list
        $('#symptoms-list').append(`
          <div class="col s4">
            <div class="card">
              <div class="card-image">
                <img src="assets/images/symptoms/${image}" alt="Card Background">
                <span class="card-title">${severity} ${symptomNames[key]}</span>
              </div>
            </div>
          </div>
        `);
      });

    } else {
      console.error('Failed to get predictions:', data);
    }

  });

});