/**
 * Created by Laurent on 2016-11-28.
 */
import {Component} from '@angular/core';

import template from './contact.component.web.html';
import {InjectUser} from "angular2-meteor-accounts-ui";
 
@Component({
    selector: 'contact',
    template
})
@InjectUser('user')
export class ContactComponent {
    constructor() {

    }
}
