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
    },
    addAll: function() {
        console.log('AddAll!!!!');
        this.updateElement();
        this.options.element.fullCalendar('addEventSource', this.collection.toJSON());
    },
    updateElement: function() {
        if (!this.options.element.length) {
            console.log("jQuery element doesn't seem to exist, researching");
            this.options.element = $(this.options.element.selector);
        }
    }
});