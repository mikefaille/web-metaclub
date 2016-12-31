/**
 * Created by Alexis on 2016-11-27.
 */
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Events = new Mongo.Collection('events');

/**
 * NOTICE : If you update this code, update the model in models/event.models.ts
 * We create a schema for the events and attach it to the Events collection.
 * This schema will be validated automatically on insert/delete.
 * @see https://github.com/aldeed/meteor-collection2
 */
Events.attachSchema(new SimpleSchema({
    _id: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
    name: {type: String},
    title: {type: String},
    description: {type: String, optional: true},
    start_datetime: {type: Date},
    end_datetime: {type: Date},
    all_day: {type: Boolean},
    url: {type: String},
    categories_ids: {type: Array, optional: true},
    'categories_ids.$': {type: String},
    creator_id: {type: String},
    club_id: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
}));