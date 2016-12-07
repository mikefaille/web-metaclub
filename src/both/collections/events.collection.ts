/**
 * Created by Alexis on 2016-11-27.
 */
import {Mongo} from 'meteor/mongo';


export const Events = new Mongo.Collection('events');

/**
 * We create a schema for the events and attach it to the Events collection.
 * This schema will be validaetd automatically on insert/delete.
 * @see https://github.com/aldeed/meteor-collection2
 */
Events.attachSchema(new SimpleSchema({
    name: {type: String},
    description: {type: String},
    startDatetime: {type: Date},
    endDatetime: {type: Date},
    creatorId: {type: String, regEx: SimpleSchema.RegEx.Id},
    clubId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
}));
