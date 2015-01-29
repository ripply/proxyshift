var moment = require('moment');
var FullCalendar = require('fullcalendar-browser');
var Marionette = require('backbone.marionette');


module.exports = FullCalendarView = Marionette.ItemView.extend({
    template: require('../../../templates/shifts/calendar.hbs'),

    initialize: function () {
        //_.bindAll(this);
        this.options.model.bind('reset', this.addAll);
    },
    onRender: function () {
        this.options.el.fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay',
                ignoreTimezone: false
            },
            selectable: true,
            selectHelper: true,
            editable: true
        });
        console.log('.fullCalendar call success!!!');
    },
    addAll: function () {
        this.options.el.fullCalendar('addEventSource', this.collection.toJSON());
    }
});