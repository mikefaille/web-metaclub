import {Meteor} from 'meteor/meteor';

import './imports/publications/users';
import './imports/publications/eventscategories';
import './imports/publications/events';

import {loadEvents} from './imports/fixtures/events';
import {loadEventsCategories} from './imports/fixtures/eventscategories';

Meteor.startup(() => {
    //IMPORTANT : The other of the fixtures loading is crucial. Some loading events depends on the others.
    loadEventsCategories();
    loadEvents();
});
