
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireAuthModule } from '@angular/fire/auth';

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
    ],
    imports: [
        ReactiveFormsModule,
        AngularFireAuthModule,
        SharedModule,
        AuthRoutingModule
    ]
})
export class AuthModule {

}