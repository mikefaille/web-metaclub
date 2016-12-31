/**
 * Created by Alexis on 2016-11-16.
 */
import {Component} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import template from './home.component.web.html';
import {Events} from  '../../../../both/collections/events.collection';
import {InjectUser} from "angular2-meteor-accounts-ui";

@Component({
    selector: 'home',
    template
})
@InjectUser('user')
export class HomeComponent {

    constructor() {

    }
}
