/**
 * Created by Alexis on 2016-11-27.
 */
import {CollectionObject} from './collection-object.model';


//If you edit this, please edit the validation schema in events.collections
export interface FullCalendarEvent extends CollectionObject {
    name: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay: boolean;
    url: string;
    categories_ids?: Array<string>;
}

