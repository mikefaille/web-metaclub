import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AccountsModule} from 'angular2-meteor-accounts-ui';
import {Ng2PaginationModule} from 'ng2-pagination';
import {AgmCoreModule} from 'angular2-google-maps/core';

import {HomeComponent} from "./home/home.component.web";
import {ContactComponent} from "./contact/contact.component.web";
import {AppComponent} from "./app.component.web";
import {routes, ROUTES_PROVIDERS} from './app.routes';
import {SHARED_DECLARATIONS} from './shared';
import {MdButtonModule} from "@angular2-material/button";
import {MdToolbarModule} from "@angular2-material/toolbar";
import {MdInputModule} from "@angular2-material/input";
import {MdCardModule} from "@angular2-material/card";
import {MdCoreModule} from "@angular2-material/core";
import {MdCheckboxModule} from "@angular2-material/checkbox";
import {MdListModule} from "@angular2-material/list";
import {AUTH_DECLARATIONS} from "./auth/index";
import {FileDropModule} from "angular2-file-drop";

let moduleDefinition;

if (Meteor.isCordova) {
    moduleDefinition = {
        imports: [
            Ng2PaginationModule
        ],
        declarations: [
            ...SHARED_DECLARATIONS
        ],
        providers: [],
        bootstrap: [
        ],
        entryComponents: []
    }
}
else {
    moduleDefinition = {
        imports: [
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule.forRoot(routes),
            AccountsModule,
            AgmCoreModule.forRoot({
                apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
            }),
            MdCoreModule.forRoot(),
            MdButtonModule.forRoot(),
            MdToolbarModule.forRoot(),
            MdInputModule.forRoot(),
            MdCardModule.forRoot(),
            MdCheckboxModule.forRoot(),
            MdListModule.forRoot(),
            FileDropModule
        ],
        declarations: [
            AppComponent,
            HomeComponent,
            ContactComponent,
            ...SHARED_DECLARATIONS,
            ...AUTH_DECLARATIONS
        ],
        providers: [
            ...ROUTES_PROVIDERS
        ],
        bootstrap: [
            AppComponent
        ]
    }
}

@NgModule(moduleDefinition)
export class AppModule {
}