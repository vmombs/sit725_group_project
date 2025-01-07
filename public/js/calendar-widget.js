$(document).ready(function () {
  // scale the date widget appropriately
  $('.ui-datepicker').css('font-size', $('.ui-datepicker').width() / 10 + 'px');

  // TODO: use this later to get current selected date
  var dateObject = $(this).datepicker('getDate');

});