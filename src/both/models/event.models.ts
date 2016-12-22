/**
 * Created by Alexis on 2016-11-27.
 */
import {CollectionObject} from './collection-object.model';


//If you edit this, please edit the validation schema in events.collections
export interface Event extends CollectionObject {
    name: string;
    title: string;
    description?: string;
    start_datetime: Date;
    end_datetime: Date;
    all_day: boolean;
    url: string;
    creator_id: string;
    categories_ids?: Array<string>;
    club_id?: string;
}

