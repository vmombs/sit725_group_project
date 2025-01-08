$(document).ready(function () {
  $('input.autocomplete').autocomplete({
    data: {
      "Congestion": null,
      "Watery Eyes": null,
      "Itchy Eyes": null,
      "Sinus Pressure": null,
      "Sneezing": null
    },
  });

  $('select').formSelect();


  $('#add-symptoms-button').on('click', function () {
    // Get the values of the input fields
    const symptomsValue = $('#symptoms').val();
    const severityValue = $('#severity-symptoms').val();

    // Log the values (or handle them as needed)
    console.log("Symptoms:", symptomsValue);
    console.log("Severity:", severityValue);

    // Reset the input fields
    $('#symptoms').val(''); // Clear the text input
    $('#severity-symptoms').prop('selectedIndex', 0); // Reset the select to the first (default) option
    $('select').formSelect(); // Reinitialize Materialize select to update the UI
  });
});