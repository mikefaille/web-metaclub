/**
 * Created by Alexis on 2016-11-27.
 */
import {CollectionObject} from './collection-object.model';


//If you edit this, please edit the validation schema in eventscategories.collections
export interface EventCategory extends CollectionObject {
    name: string;
    description?: string;
    parent_id: string;
    checked?: boolean;//Only to avoid TypeScript errors
}

