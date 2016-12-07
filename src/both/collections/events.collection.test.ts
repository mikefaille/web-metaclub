import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Events} from './events.collection';
import {assert} from 'meteor/practicalmeteor:chai';

if (Meteor.isServer) {
    describe('Events / Schema validations', () => {
        describe('Insert validations', () => {
            let eventTemplate = {
                name: 'test',
                description: 'Just a description',
                startDatetime: new Date(""),
                endDatetime: new Date(""),
                creatorId: new Mongo.ObjectID(),
                clubId: new Mongo.ObjectID()
            };

            it('should fail on empty event', (done) => {
                Events.insert({}, (error,result)=> {
                    done(assert.notEqual(error, undefined));
                });
            });

            it('should fail without a name attribute', (done) => {
                let withoutNameObj = Object.assign({},eventTemplate);
                delete withoutNameObj.name;
                Events.insert(withoutNameObj,(error,result)=>{
                   done(assert.notEqual(error,undefined));
                });
            });

        });

        describe('Update validations', () => {

        });
    });
}