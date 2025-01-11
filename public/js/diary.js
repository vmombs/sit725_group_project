$(document).ready(function () {

  var fullDate = $.datepicker.formatDate("mm-dd-yy", new Date());

  // initialise the datepicker
  $("#datepicker").datepicker({
    showButtonPanel: true,
    dateFormat: "dd/mm/yyyy",
    maxDate: 0,
    onSelect: function () {
      fullDate = $.datepicker.formatDate("mm-dd-yy", $(this).datepicker('getDate'));
    }
  });

  // scale the date widget appropriately
  $('.ui-datepicker').css('font-size', $('.ui-datepicker').width() / 10 + 'px');

  // set up medication name autocomplete
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

    // initialise medication quantity selector
    $('select').formSelect();

    // actions to take when add-medication clicked
    $('#add-medication-button').on('click', function () {
      // get the values of the input fields
      const medicationValue = $('#medication').val();
      const quantityValue = $('#quantity-medication').val();

      // log the values (or handle them as needed)
      console.log("Medication:", medicationValue);
      console.log("Quantity:", quantityValue);
      console.log("Date:", fullDate);

      // reset the input fields
      $('#medication').val(''); 
      $('#quantity-medication').prop('selectedIndex', 0);
      $('select').formSelect();
    });
  });

});