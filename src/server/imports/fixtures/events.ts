import {Events} from '../../../both/collections/events.collection';
import {EventsCategories} from '../../../both/collections/eventscategories.collection';
import {EventCategory} from '../../../both/models/eventcategory.models';

import {Event} from '../../../both/models/event.models';

export function loadEvents() {
    if (Events.find({}).count() === 0) {
        const events: Event[] = generateEvents(200);
        events.forEach((event: Event) => Events.insert(event));
    }
}

function generateEvents(count: number) {
    let categories: Array<EventCategory> = EventsCategories.find({}).fetch() as Array<EventCategory>;
    let startDateCursor = new Date();
    let endDateCursor: Date;

    if (count < 0)
        count = 1;
    let events: Event[] = [];
    for (let i = 0; i < count; i++) {
        //Length of the  event in minutes
        let eventLength = Math.floor(Math.random() * 120) + 1;
        endDateCursor = new Date(startDateCursor.getTime() + eventLength * 60000);
        let randomCategory = categories[Math.floor(Math.random() * categories.length)];
        events.push({
            name: "Event" + i,
            title: "Title" + i,
            description: "Description" + i,
            start_datetime: new Date(startDateCursor.getTime()),
            end_datetime: new Date(endDateCursor.getTime()),
            all_day: false,
            url: "/events/" + i,
            categories_ids: [randomCategory._id],
            creator_id: (new Mongo.ObjectID()).toHexString()
        });

        startDateCursor = new Date(endDateCursor.getTime() + ((Math.floor(Math.random() * 12) + 1) * 3600000));
    }
    return events;
}