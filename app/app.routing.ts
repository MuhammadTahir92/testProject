import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { StartupComponent } from "./startup/startup.component";

const routes: Routes = [
    { path: "", redirectTo: "/startup", pathMatch: "full" },
    { path: "startup", component: StartupComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }