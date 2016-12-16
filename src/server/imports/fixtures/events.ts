import {Events} from '../../../both/collections/events.collection';
import {Event} from '../../../both/models/events.models';

export function loadEvents() {
    if (Events.find({}).count() === 0) {
        const events: Event[] = generateEvents(200);
        events.forEach((event: Event) => Events.insert(event));
    }
}

function generateEvents(count: number) {
    let startDateCursor = new Date();
    let endDateCursor: Date;

    if (count < 0)
        count = 1;
    let events: Event[] = [];
    for (let i = 0; i < count; i++) {
        //Length of the  event in minutes
        let eventLength = Math.floor(Math.random() * 120) + 1;
        endDateCursor = new Date(startDateCursor.getTime() + eventLength * 60000);
        events.push({
            name: "Event" + i,
            title: "Title" + i,
            description: "Description" + i,
            startDatetime: new Date(startDateCursor.getTime()),
            endDatetime: new Date(endDateCursor.getTime()),
            allDay: false,
            url: "/event" + i,
            creatorId: (new Mongo.ObjectID()).toHexString()
        });

        startDateCursor = new Date(endDateCursor.getTime() + ((Math.floor(Math.random() * 12) + 1) * 3600000));
    }
    return events;
}