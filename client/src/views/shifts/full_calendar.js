var moment = require('moment');
var FullCalendar = require('fullcalendar-browser');
var Marionette = require('backbone.marionette');

module.exports = FullCalendarView = Marionette.ItemView.extend({
    //el: '#js-boilerplate-app',
    template: require('../../../templates/shifts/calendar.hbs'),

    initialize: function() {
        //_.bindAll(this);
        this.options.collection.bind('reset', this.addAll);
        this.options.collection.fetch({
            success: function() {
                console.log('retrieved shift collection');
            },
            error: function() {
                console.log('failed to retrieve shift collection');
            }
        });
    },
    onShow: function() {
        console.log("FullCalendarViar#onRender");
        console.log(this.options.element);
        this.updateElement();
        if (!this.options.element.length) {
            console.error("Cannot find full calendar object, calendar will fail to render");
        }
        this.options.element.fullCalendar({
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
        console.log('#fullCalendar call success!!!');
        this.addAll();
    },
    addAll: function() {
        console.log('AddAll!!!!');
        this.updateElement();
        var self = this;
        this.collection.fetch({
            success: function() {
                var shifts = self.collection.toJSON();
                if (shifts.length === 0) {
                    console.log("WARNING: THERE ARE ZERO SHIFTS BEING GIVEN TO THE CALENDAR");
                }
                self.options.element.fullCalendar('addEventSource', shifts);
            }
        });
    },
    updateElement: function() {
        if (!this.options.element.length) {
            console.log("jQuery element doesn't seem to exist, researching");
            this.options.element = $(this.options.element.selector);
        }
    }
});