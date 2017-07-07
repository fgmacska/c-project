import { AdminGuardService } from './shared/services/admin-guard.service';
import { ObservationResolver } from './shared/resolvers/observation.resolver';
import { AuthResolver } from './shared/resolvers/auth.resolver';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FB_CONFIG } from './config';
import { SignupComponent } from './signup/signup.component';
import { ProfilComponent } from './profil/profil.component';
import { routes } from './app.routes';
import { ObservationComponent } from './observation/observation.component';

import { AuthGuardService } from './shared/services/auth-guard.service';
import { ObservationService } from './shared/services/observation.service';
import { MdDataTableModule } from 'ng2-md-datatable';

import { ListComponent } from './shared/components/list/list.component';
import {DataTableModule,SharedModule} from 'primeng/primeng';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ObservationFormComponent } from './observation-form/observation-form.component';
import { ProfileFormComponent } from './profil/profile-form/profile-form.component';
import { MemberComponent } from './member/member.component';
import { MaterialModule } from '@angular/material';
import { MaterializeModule } from 'angular2-materialize';
import { ProfileWidgetComponent } from './shared/components/profile-widget/profile-widget.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfilComponent,
    ObservationComponent,
    ListComponent,
    MenuComponent,
    ModalComponent,
    ObservationFormComponent,
    ProfileFormComponent,
    MemberComponent,
    ProfileWidgetComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MdDataTableModule,
    DataTableModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterializeModule,
    MaterialModule,
    AngularFireModule.initializeApp(FB_CONFIG),
    routes
  ],
  providers: [
    AuthGuardService,
    AdminGuardService,
    ObservationService, 
    UserService,
    AuthService,
    AuthResolver,
    ObservationResolver,
    AngularFireDatabase,
    AngularFireAuth
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
