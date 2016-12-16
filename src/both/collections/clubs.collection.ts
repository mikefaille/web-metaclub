/**
 * Created by Alexis on 2016-11-27.
 */
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
export const Clubs = new Mongo.Collection('clubs');

/**
 * Basic schema for a club. This is temporary
 */
Clubs.attachSchema(new SimpleSchema({
    name: {type: String},
    description: {type: String},
    clubId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: true},
}));
