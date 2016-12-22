/**
 * Created by Alexis on 2016-11-27.
 */
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const EventsCategories = new Mongo.Collection('eventscategories');

/**
 * NOTICE : If you update this code, update the model in models/eventcategory.models.ts
 * We create a schema for the events and attach it to the Events collection.
 * This schema will be validated automatically on insert/delete.
 * @see https://github.com/aldeed/meteor-collection2
 */
EventsCategories.attachSchema(new SimpleSchema({
    _id: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
    name: {type: String},
    description: {type: String,optional:true},
    parent_id: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true}
}));