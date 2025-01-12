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
    $('#medication').autocomplete({
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

      // construct data to post
      let medicationData = {};
      medicationData.date = fullDate;
      medicationData.name = medicationValue;
      medicationData.quantity = quantityValue;

      $.ajax({
        url: '/diary/add-medication',
        type: 'POST',
        data: medicationData,
        success: (result) => {
          if (result.statusCode === 201) {
            // reset the input fields
            $('#medication').val('');
            $('#quantity-medication').prop('selectedIndex', 0);
            $('select').formSelect();
          }
        }
      });
    });
  });

  // set up symptom form automcomplete
  $('#symptoms').autocomplete({
    data: {
      "Congestion": null,
      "Watery Eyes": null,
      "Itchy Eyes": null,
      "Sinus Pressure": null,
      "Sneezing": null
    },
  });

  $('select').formSelect();

  // actions to take when add-symptoms clicked
  $('#add-symptoms-button').on('click', function () {
    // Get the values of the input fields
    const symptomsValue = $('#symptoms').val();
    const severityValue = $('#severity-symptoms').val();

    // construct data to post
    let symptomData = {};
    symptomData.date = fullDate;
    symptomData.name = symptomsValue;
    symptomData.severity = severityValue;

    $.ajax({
      url: '/diary/add-symptom',
      type: 'POST',
      data: symptomData,
      success: (result) => {
        if (result.statusCode === 201) {
          alert('symptom posted');
          // reset the input fields
          $('#symptoms').val('');
          $('#severity-symptoms').prop('selectedIndex', 0);
          $('select').formSelect();
        }
      }
    });
  });

});