$(document).ready(function () {
  $('input.autocomplete').autocomplete({
    data: {
      "Azelastine (Astepro)": null,
      "Ketotifen (Alaway, Zaditor)": null,
      "Olopatadine (Pataday)": null,
      "Cetirizine (Zyrtec Allergy)": null,
      "Loratadine (Alavert, Claritin)": null,
      "Fexofenadine (Allegra Allergy)": null,
      "Desloratadine (Clarinex)": null,
      "Mometasone (Nasonex)": null,
      "Fluticasone propionate (Flonase Allergy Relief)": null,
      "Ciclesonide (Zetonna)": null,
      "Loteprednol (Alrex, Lotemax)": null,
      "Prednisolone (Omnipred, Pred Forte, others)": null,
      "Prednisolone (Prelone)": null,
      "Methylprednisolone (Medrol)": null,
    },
  });

  $('select').formSelect();


  $('#add-medication-button').on('click', function () {
    // Get the values of the input fields
    const medicationValue = $('#medication').val();
    const quantityValue = $('#quantity-medication').val();

    // Log the values (or handle them as needed)
    console.log("Medication:", medicationValue);
    console.log("Quantity:", quantityValue);

    // Reset the input fields
    $('#medication').val(''); // Clear the text input
    $('#quantity-medication').prop('selectedIndex', 0); // Reset the select to the first (default) option
    $('select').formSelect(); // Reinitialize Materialize select to update the UI
  });
});