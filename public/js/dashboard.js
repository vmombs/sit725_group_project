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
  
  await $.get('/medications', (data) => {
    if (data.statusCode === 200) {
      const medicationData = data.data;
      console.log('Medication data:', medicationData);

      medicationData.forEach((record) => {
        console.log('Record:', record);

        let image = '';

        if (String(record.name).toLowerCase().includes('aspirin')) image = 'aspirin.jpg';
        else if (String(record.name).toLowerCase().includes('ibuprofen')) image = 'ibuprofen.jpg';
        else if (String(record.name).toLowerCase().includes('paracetamol')) image = 'paracetamol.jpg';
        else if (String(record.name).toLowerCase().includes('allegra')) image = 'allegra.jpg';
        else if (String(record.name).toLowerCase().includes('claritin')) image = 'claritin.jpg';
        else if (String(record.name).toLowerCase().includes('zyrtec')) image = 'zyrtec.jpg';

        // add div to #symptoms-list
        $('#medications-list').append(`
          <div class="col s4">
            <div class="card">
              <div class="card-image">
                <img src="assets/images/medications/${image}" alt="Card Background">
                <span class="card-title">${ record.quantity }x ${ record.name }</span>
              </div>
            </div>
          </div>
        `);
      });
    }

    else {
      console.error('Failed to get medication data:', data);
    }
  });

  await $.get('/symptoms', (data) => {
    if (data.statusCode === 200) {
      const symptomsData = data.data;
      console.log('Symptoms data:', symptomsData);

      symptomsData.forEach((record) => {
        console.log('Record:', record);

        let image = '';
        if (String(record.name).toLowerCase().includes('headache')) image = 'headache.jpg';
        else if (String(record.name).toLowerCase().includes('cough')) image = 'cough.jpg';
        else if (String(record.name).toLowerCase().includes('congestion')) image = 'congestion.jpg';
        else if (String(record.name).toLowerCase().includes('hayfever')) image = 'sneezing.jpg';
        else if (String(record.name).toLowerCase().includes('fever')) image = 'fever.jpg';
        else if (String(record.name).toLowerCase().includes('sneezing')) image = 'sneezing.jpg';
        else if (String(record.name).toLowerCase().includes('watery eyes')) image = 'watery-eyes.jpg';

        let severity = '';
        if (record.severity == 1) severity = 'Mild';
        else if (record.severity == 2) severity = 'Moderate';
        else if (record.severity == 3) severity = 'Severe';
    
        // add div to #symptoms-list
        $('#symptoms-list').append(`
          <div class="col s4">
            <div class="card">
              <div class="card-image">
                <img src="assets/images/symptoms/${image}" alt="Card Background">
                <span class="card-title">${ severity } ${ record.name }</span>
              </div>
            </div>
          </div>
        `);
      });
    }

    else {
      console.error('Failed to get symptoms data:', data);
    }
  });

});