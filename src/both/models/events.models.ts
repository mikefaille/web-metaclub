/**
 * Created by Alexis on 2016-11-27.
 */
import {CollectionObject} from './collection-object.model';


//If you edit this, please edit the validation schema in events.collections
export interface Event extends CollectionObject {
    name: string;
    title: string;
    description: string;
    startDatetime: Date;
    endDatetime: Date;
    allDay:boolean;
    url:string;
    creatorId: string;
    clubId?: string;
}

