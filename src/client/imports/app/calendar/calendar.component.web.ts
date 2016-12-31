/**
 * Created by Alexis on 2016-11-16.
 */
import {Component, ViewChild, ChangeDetectorRef} from '@angular/core';

import template from './calendar.component.web.html';
import {Meteor} from "meteor/meteor";
import {InjectUser} from "angular2-meteor-accounts-ui";
import SubscriptionHandle = Meteor.SubscriptionHandle;

//Collections
import {Events} from  '../../../../both/collections/events.collection';
import {EventsCategories} from  '../../../../both/collections/eventscategories.collection';

//Models
import {Event} from '../../../../both/models/event.models';
import {EventCategory} from '../../../../both/models/eventcategory.models';
import {FullCalendarEvent} from '../../../../both/models/fullcalendarevent.models';

//Angular-tree components
import {TreeComponent, IActionMapping, KEYS, TREE_ACTIONS} from "angular2-tree-component";
import {ITreeNode} from "angular2-tree-component/dist/defs/api";

/**
 * Action matting for full calendar.
 * @type {{mouse: {click: ((tree:TreeModel, node:TreeNode, $event:any)=>TreeNode)}; keys: {}}}
 */
export const actionMapping: IActionMapping = {
    mouse: {click: TREE_ACTIONS.TOGGLE_SELECTED_MULTI},
    keys: {}
};


@Component({
    selector: 'calendar',
    template
})
@InjectUser('user')
export class CalendarComponent {
    subscriptions: Array<SubscriptionHandle> = [];
    defaultDate: Date;
    nodes: Array<Object>;
    selectedNodes: Array<string>;
    allNodeId: string;
    treefilterOpts: Object;
    @ViewChild(TreeComponent)
    private tree: TreeComponent;


    constructor(private cdRef: ChangeDetectorRef) {
        this.defaultDate = new Date();
        this.treefilterOpts = {actionMapping, idField: '_id'};
        this.nodes = [];
        this.selectedNodes = [];
        this.allNodeId = (new Date()).getTime().toString();


        let handle = Meteor.subscribe('eventscategories.all', {
            onError: () => {
                console.error("Failed to load categories");
                //TODO : What we do here?
            }, onReady: () => {
                this.nodes = this.getFilterTree(this.selectedNodes);
                this.tree.treeModel.update();
                //TODO: Is there a way to replace detectChanges() for UI update?
                this.cdRef.detectChanges();
                //Check the first node.
                this.tree.treeModel.getFirstRoot().toggleActivated(true);
                this.cdRef.detectChanges();
            }
        });

        //Add the subscriptions into the array to destroy later.
        this.subscriptions.push(handle);
    }

    /**
     * Called by Angluar on Init
     */
    public ngOnInit() {
        $(document).ready(() => {
            //FullCalendar configuration and init
            $('#calendar').fullCalendar({
                events: this.getEvents.bind(this),
                defaultDate: this.defaultDate,
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay'
                },
                eventRender: this.eventRender.bind(this),
                eventClick: this.onEventClick,
                eventLimit: true
            });
        });


    }

    /**
     * Called by angular on destroy
     */
    public ngOnDestroy() {
        //Subscriptions cleanup
        for (let sub in this.subscriptions) {
            this.subscriptions[sub].stop();
        }
    }

    /**
     * Get a filter tree of nodes. Also, if an array is passed in the parameter, it will be populated with the focused nodes
     * @param flatNodes An array modified by reference. This array contained the nodes focused.
     * @returns {{_id: number, name: string, checked: boolean}[]}
     */
    public getFilterTree(flatNodes: Array<string>) {
        let categories: Array<EventCategory> = EventsCategories.find({}).fetch() as Array<EventCategory>;
        categories.map((node) => {
            //All checked by default
            node.checked = false;
            flatNodes.push(node._id);
        });
        let tree = this.buildTreeFromArray(categories, 'parent_id', '_id');
        let nodes = [{
            _id: this.allNodeId,
            name: "All",
            checked: false
        }];
        for (let node in tree)
            if (tree.hasOwnProperty(node))
                nodes.push(tree[node]);
        return nodes;
    }

    /**
     *  Build a nested tree with a unordered flat array.
     * @todo Extract this code to an helper
     * @param array The array that will be used to get a tree.
     * @param {string}  parentCol   The name of the property to get the parent id.
     * @param {string} [childrenPlaceHolder="children"] The children placeholder. This is the property where the children will be added.
     * @param {string} [keyCol="_id"]   The name of the property that contains the identifier of each element. Used for indexing.
     * @returns {{[id: string]: Object}}
     */
    public buildTreeFromArray(array: Array<any>, parentCol: string, keyCol: string = "_id") {
        if (!keyCol || keyCol.trim().length == 0)
            throw new TypeError("keyCol must be a valid property name.");
        let group = this.arrayToObject(array, '_id');
        let isOrphan = true;
        while (isOrphan) {
            isOrphan = false;
            for (let parentId in group) {
                if (!group.hasOwnProperty(parentId))
                    continue;
                let hasChildren = false;
                let parent = group[parentId];
                //Compare with all the remaining elements
                for (let childId in group) {
                    if (!group.hasOwnProperty(childId))
                        continue;
                    let child = group[childId];
                    if (child[parentCol] && child[parentCol] == parentId) {
                        hasChildren = true;
                        isOrphan = true;
                        break;
                    }
                }
                if ((!hasChildren && parent[parentCol])) {
                    let realParent = group[parent[parentCol]];
                    if (!realParent.children)
                        realParent.children = [];
                    realParent.children.push(parent);
                    delete group[parentId];
                }
            }
        }
        return group;
    }

    /**
     * @todo Extract this code to an helper
     * Group array's elements into an hashmap
     * @param {Array<Object>} array The array to group
     * @param {string} keyCol   The property of the elements that will be used for indexing
     * @returns {Object}    Returns an object with all the elements indexed.
     */
    public arrayToObject(array: Array <Object>, keyCol: string) {
        let group = {};
        array.forEach((elem) => {
            if (elem[keyCol])
                group[elem[keyCol]] = elem;
        });
        return group;
    }


    /**
     * Get the events from the remove database
     * @param {Object} start  The start date of the events to fetch
     * @param {Object} end    The end date of the events to fetch.
     * @param {boolean|string} timezone False if no timezone are used. Otherwise the name of the timezone
     * @param callback  The callback function called when the events are fetched.
     */
    public getEvents(start, end, timezone, callback: Function): void {
        //We make the subscriptions
        let handle = Meteor.subscribe('events.byDateRange', start.toDate(), end.toDate(), {
            onError: () => {
                console.error("Failed to load events");
                //TODO : What we do here?
                callback([]);
            }, onReady: () => {
                callback(this._fetchEvents(start.toDate(), end.toDate()));
            }
        });

        //Add the subscriptions into the array to destroy later.
        this.subscriptions.push(handle);
    }

    /**
     * @todo Add directly to the collection or a collection helper?
     * Convert MongoDB events to fullcalendar.io format
     * @param {Array<Event>} [events=[]] An array of events to convert
     * @return {Array<FullCalendarEvent>}  The events converted.
     */
    public convertEventsToFullCalendar(events: Array<Event> = []): Array<FullCalendarEvent> {
        let convertedEvents = [];
        for (let event of events) {
            convertedEvents.push({
                id: event._id,
                title: event.title,
                description: event.description,
                start: event.start_datetime,
                end: event.end_datetime,
                allDay: event.all_day,
                url: event.url,
                categories_ids: event.categories_ids
            });
        }
        return convertedEvents;
    }

    /**
     * Event handler for event click
     * @param event Event object that holds data,title,etc.
     * @param jsEvent   The native JavaScript event object
     * @param view  The View Object
     *
     * @see  https://fullcalendar.io/docs/mouse/eventClick/
     */
    public onEventClick(event, jsEvent, view) {
        //TODO : Add logic on event click
        console.log(event.categories_ids);
        return false;
    }

    /**
     *
     * @param data
     * @param jsEvent
     * @param view
     * @see https://fullcalendar.io/docs/mouse/dayClick/
     */
    public   onDayClick(data, jsEvent, view) {

    }

    /**
     * Render function called for every event in the calendar
     * @see https://fullcalendar.io/docs/event_rendering/eventRender/
     * @param {FullCalendarEvent} event The event object that contains the data.
     * @param element   The HTML element
     * @param view  Undocumented
     * @returns {boolean}   Returns true to render. Otherwise false.
     */
    public eventRender(event: FullCalendarEvent, element, view) {
        if (this.selectedNodes.indexOf(this.allNodeId) > -1) //All
            return true;
        else if (event.categories_ids.length > 0) {
            let isFiltered = false;
            for (let i = 0; i < event.categories_ids.length; i++) {
                if (this.selectedNodes.indexOf(event.categories_ids[i]) == -1) {
                    isFiltered = true;
                    break;
                }
            }
            return !isFiltered;
        }
        return false;
    }

    /**
     * Event handle when a filter node get clicked
     * @see  https://angular2-tree.readme.io/docs/events
     * @param event The event object.
     */
    public onFilterNodeActivated(event) {
        let node = event.node;
        let nodeId = node.id;
        node.data.checked = true;

        //We precalculate the selected nodes to optimize filtering of events
        let hasChange = this._updateSelectedNodes(node, true);
        if (hasChange) {
            $('#calendar').fullCalendar('rerenderEvents');
        }

        if (node.id == this.allNodeId) //We handle all the siblings
            node = node.parent;
        //Children activation
        if (node.children && node.children.length > 0) {
            node.children.forEach((i: ITreeNode) => {
                if (i.id !== this.allNodeId && i.id !== nodeId && !i.isActive) {
                    i.toggleActivated(true);
                }
            });
        }
    }

    /**
     * Event handler when a a filter node get deactivated.
     * @see https://angular2-tree.readme.io/docs/events
     * @param event The triggered event
     */
    public onFilterNodeDeactivated(event) {
        let node = event.node;
        let nodeId = node.id;
        node.data.checked = false;

        //We precalculate the selected nodes to optimize filtering of events
        let hasChange = this._updateSelectedNodes(node, false);
        if (hasChange) {
            $('#calendar').fullCalendar('rerenderEvents');
        }
        // All vs normal node validation
        if (node.id == this.allNodeId)
            node = node.parent;
        //Children deactivation
        if (node.children && node.children.length > 0) {
            node.children.forEach((i: ITreeNode) => {
                if (i.id !== this.allNodeId && i.id !== nodeId && i.isActive) {
                    i.toggleActivated(true);
                }
            });
        }
    }

    /**
     * This function update the selected nodes array and detect if changes has been made to the current node.
     * @param {ITreeNode} node  The current node to update
     * @param {boolean} activate    Determine if we need to activate(true) or deactive(false) the node.
     * @returns {boolean}   Determines if changes has been made to the current node.
     * @private
     */
    private _updateSelectedNodes(node: ITreeNode, activate: boolean): boolean {
        let nodePos = this.selectedNodes.indexOf(node.id);
        let isSelected = nodePos > -1;

        //Update the selected nodes
        if (isSelected && !activate) {
            //We remove the node
            this.selectedNodes.splice(nodePos, 1);
        }
        else if (!isSelected && activate) {
            //We add the node
            this.selectedNodes.push(node.id);
        } else //No changes has been done
            return false;

        //All vs normal node validation
        if (node.id == this.allNodeId)
            node = node.parent;
        //Children recursive update
        if (node.children && node.children.length > 0) {
            node.children.forEach((n: ITreeNode) => {
                if (n.id !== this.allNodeId)
                    this._updateSelectedNodes(n, activate);
            })
        }

        //We return a boolean that determine if a change has been made to this node.
        return true;
    }

    /**
     * Fetch the events once synchronized locally
     * @param {Date} start  The start date of the events to fetch
     * @param {Date} end    The end date of the events to fetch.
     * @return {Array}  An array of events ready for FullCalendar.io
     */
    private _fetchEvents(start: Date, end: Date) {
        //Fetch all the events from the calendar date range
        let dbEvents: Array<Event> = Events.find({
            start_datetime: {
                '$gte': start
            },
            end_datetime: {
                '$lte': end
            }
        }, {reactive: false}).fetch() as Array<Event>;


        //Adapt events for the library
        return this.convertEventsToFullCalendar(dbEvents);
    }

}
