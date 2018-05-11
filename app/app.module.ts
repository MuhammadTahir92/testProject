import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { StartupComponent } from './startup/startup.component';
import { NativeScriptUIListViewModule } from "nativescript-pro-ui/listview/angular";
import { registerElement } from "nativescript-angular";
registerElement("Gradient", () => require("nativescript-gradient").Gradient);
import { PagerModule } from "nativescript-pager/angular";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { NgShadowModule } from 'nativescript-ng-shadow';

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptUIListViewModule,
        PagerModule,
        NativeScriptAnimationsModule,
        NgShadowModule
    ],
    declarations: [
        AppComponent,
    StartupComponent
],
    providers: [
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
