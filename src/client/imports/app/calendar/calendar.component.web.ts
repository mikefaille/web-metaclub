/**
 * Created by Alexis on 2016-11-16.
 */
import {Component} from '@angular/core';

import template from './calendar.component.web.html';
import {Events} from  '../../../../both/collections/events.collection';
import {Event} from '../../../../both/models/events.models';
import {InjectUser} from "angular2-meteor-accounts-ui";
import {Meteor} from "meteor/meteor";
import SubscriptionHandle = Meteor.SubscriptionHandle;

@Component({
    selector: 'calendar',
    template
})
@InjectUser('user')
export class CalendarComponent {
    eventsSubscriptions: SubscriptionByISODate = {};
    newEventsSubscriptions: Array<SubscriptionHandle> = [];
    defaultDate: Date;


    constructor() {
        this.defaultDate = new Date();
    }

    ngOnInit() {

        $(document).ready(() => {
            $('#calendar').fullCalendar({
                events: this.getEvents.bind(this),
                defaultDate: this.defaultDate,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                eventLimit: true,
                eventClick: function (event, jsEvent, view) {
                    // window.location = event.url;
                }
            });
        });
    }

    ngOnDestroy() {
        //Cleanup the subscriptions
        for (let sub in this.eventsSubscriptions) {
            this.eventsSubscriptions[sub].stop();
        }
    }

    /**
     * Get the starting datetime of the current month
     * @param date  The date to handle the month from
     * @return {Date}   The starting datetime of the current month
     */
    private getMonthStartingDate(date: Date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), 1);
    }

    /**
     * Get the ending datetime of the current month.
     * @param date  The date to handle the month from.
     * @return {Date}   The ending datetime of the current month.
     */
    private getMonthEndingDate(date: Date) {
        let month = date.getUTCMonth();

        //We validate the end of the year
        month = month == 11 ? 0 : month += 1;
        let endingDate = new Date(date.getUTCFullYear(), month, 1);

        //We remove 1 second to get the ending date and not the starting date of the next month
        endingDate.setTime(endingDate.getTime() - 1000);
        return endingDate;
    }

    /**
     * Subscribe to the events with the ability to select the previous and next depth in months of the data.
     * @param {Date} date  The date on which the subscriptions will be based
     * @param {number} [previousDepth=0] The previous depth in month.
     * @param {number} [nextDepth=0] The next depth in month.
     * @example
     * //To get 3 months before today
     * subscribeToEvents(new Date(),3);
     * //To get the next 3 months
     * subscribeToEvents(new Date(),0,3);
     */
    private subscribeToEvents(date: Date, previousDepth: number = 1, nextDepth: number = 1): void {
        //Parameter validation
        if (previousDepth < 0)
            previousDepth = 0;
        if (nextDepth < 0)
            nextDepth = 0;

        let dateCursor = Object.assign({}, date);

        //Update dates if necessary
        if (previousDepth > 0) {
            //Go back x months
            dateCursor.setUTCMonth(dateCursor.getUTCMonth() - previousDepth);
        }

        //Create subscription if necessary
        //The subscription will be build on a month basis.
        let requiredSubs = previousDepth + nextDepth;
        if (requiredSubs > 0)
            for (let i = 0; i < requiredSubs; i++, dateCursor.setUTCMonth(dateCursor.getUTCMonth() + 1)) {
                let tmpDate = this.getMonthStartingDate(dateCursor);
                if (!this.eventsSubscriptions[tmpDate.getTime()]) {
                    let monthStartingDate = this.getMonthStartingDate(tmpDate);
                    let monthEndingDate = this.getMonthEndingDate(tmpDate);
                    //We create a unique subscription for each month. Easier to handle
                    this.eventsSubscriptions[tmpDate.getTime()] = Meteor.subscribe('events.byDateRange', monthStartingDate, monthEndingDate);
                }
            }
    }

    /**
     * Get the events from the remove database
     * @param {Object} start  The start date of the events to fetch
     * @param {Object} end    The end date of the events to fetch.
     * @param {boolean|string} timezone False if no timezone are used. Otherwise the name of the timezone
     * @param callback  The callback function called when the events are fetched.
     */
    public getEvents(start, end, timezone, callback: Function): void {
        //We make the subscriptions
        let handle = Meteor.subscribe('events.byDateRange', start.toDate(), end.toDate(), {
            onError: () => {
                console.error("Failed to load events");
                //TODO : What we do here?
                callback([]);
            }, onReady: () => {
                console.info("Successfully loaded events");
                callback(this.fetchEvents(start.toDate(), end.toDate()));
            }
        });

        //Add the subscriptions into the array to destroy later.
        this.newEventsSubscriptions.push(handle);
    }

    /**
     * Fetch the events once synchronized locally
     * @param {Date} start  The start date of the events to fetch
     * @param {Date} end    The end date of the events to fetch.
     * @return {Array}  An array of events ready for FullCalendar.io
     */
    private fetchEvents(start: Date, end: Date) {
        //Fetch all the events from the calendar date range
        let dbEvents = Events.find({
            startDatetime: {
                '$gte': start
            },
            endDatetime: {
                '$lte': end
            }
        }, {reactive: false}).fetch();


        //Adapt events for the library
        return this.convertEvents(dbEvents);
    }

    /**
     * Convert MongoDB events to fullcalendar.io format
     * @param {Array} [events=[]] An array of events to convert
     * @return {Array}  The events converted.
     */
    private convertEvents(events: Array<Event> = []) {
        let convertedEvents = [];
        for (let event of events) {
            convertedEvents.push({
                id: event._id,
                title: event.title,
                description:event.description,
                start: event.startDatetime,
                end: event.endDatetime,
                allDay: false,
                url:event.url
            });
        }
        return convertedEvents;
    }
}


/**
 * Interface used for our subscription history dictionnary
 */
interface SubscriptionByISODate {
    [test: string]: SubscriptionHandle;
}

