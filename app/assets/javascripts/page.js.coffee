# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).ready ->
  $('#calendar').fullCalendar
    editable: true,
    header:
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    defaultView: 'month',
    height: 500,
    slotMinutes: 30,

    shiftSources: [{
      url: '/shifts',
    }],

    timeFormat: 'h:mm t{ - h:mm t} ',
    dragOpacity: "0.5"

    shiftDrop: (shift, dayDelta, minuteDelta, allDay, revertFunc) ->
      updateShift(shift);

    shiftResize: (shift, dayDelta, minuteDelta, revertFunc) ->
      updateShift(shift);


updateShift = (the_shift) ->
  $.update "/shifts/" + the_shiftt.id,
    shift:
      title: the_shift.title,
      starts_at: "" + the_shift.start,
      ends_at: "" + the_shift.end,
      description: the_shift.description