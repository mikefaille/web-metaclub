import {EventsCategories} from '../../../both/collections/eventscategories.collection';
import {EventCategory} from '../../../both/models/eventcategory.models';

function insertFromJSONStructure(data: Array<any>, childProp, parentId: string = null) {
    for (let cat of data) {
        let newCat: EventCategory = {name: cat.name, parent_id: parentId};
        try {
            let id = EventsCategories.insert(newCat);
            if (cat.children && cat.children.length > 0)
                insertFromJSONStructure(cat[childProp] as Array<any>, childProp, id);
        } catch (ex) {
            console.error(ex);
        }
    }
}
export function loadEventsCategories() {
    if (EventsCategories.find({}).count() === 0) {
        let struct = [{
            name: "Vehicules",
            children: [
                {
                    name: "Minifourgonettes",
                    children: [
                        {
                            name: "Chevrolet", children: [
                            {name: "Vehicule 1"}
                        ]
                        }
                    ]
                },
                {
                    name: "Camions",
                    children: [
                        {
                            name: "Dodge RAM",
                            children: [
                                {name: "Vehicule 2"},
                                {name: "Vehicule 3"}
                            ]
                        },
                        {
                            name: "Ford F-250",
                            children: [
                                {name: "Vehicule 4"}
                            ]
                        }
                    ]
                },
                {
                    name: "Remorques",
                    children: [
                        {
                            name: "33 pieds",
                            children: [
                                {name: "Vehicule 5"},
                                {name: "Vehicule 6"}
                            ]
                        },
                        {
                            name: "25 pieds",
                            children: [
                                {name: "Vehicule 7"},
                                {name: "Vehicule 8"}
                            ]
                        }
                    ]
                }
            ]
        }];
        insertFromJSONStructure(struct, "children");
    }


}