import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import {EventsCategories} from '../../../both/collections/eventscategories.collection';

if (Meteor.isServer) {


    /**
     * Publish all the categories of event.
     * @returns {Object}    A cursor for all the events categories
     */
    Meteor.publish('eventscategories.all', () => {
        return EventsCategories.find({});
    });

    /**
     * Publish a specific event category
     * @returns {Object}    A cursor for a specific event category
     */
    Meteor.publish('eventscategories.byId', (category_id) => {
        //We validate our event id
        new SimpleSchema({
            category_id: {type: String, regEx: SimpleSchema.RegEx.Id}
        }).validate({category_id});

        return EventsCategories.find({_id: category_id});
    });

}