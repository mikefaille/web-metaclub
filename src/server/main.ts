import { Meteor } from 'meteor/meteor';

import './imports/publications/users';
import './imports/publications/events';

import {loadEvents} from './imports/fixtures/events';

Meteor.startup(() => {
    //Load some events for tests purpose
loadEvents();

});
