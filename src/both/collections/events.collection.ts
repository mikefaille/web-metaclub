/**
 * Created by Alexis on 2016-11-27.
 */
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Events = new Mongo.Collection('events');

/**
 * NOTICE : If you update this code, update the model in models/events.models.ts
 * We create a schema for the events and attach it to the Events collection.
 * This schema will be validated automatically on insert/delete.
 * @see https://github.com/aldeed/meteor-collection2
 */
Events.attachSchema(new SimpleSchema({
    name: {type: String},
    title: {type: String},
    description: {type: String},
    startDatetime: {type: Date},
    endDatetime: {type: Date},
    allDay: {type: Boolean},
    url: {type: String},
    creatorId: {type: String},
    _id: {type: String, regEx: SimpleSchema.RegEx.Id,optional:true},
    clubId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
}));