import { AdminGuardService } from './shared/services/admin-guard.service';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

// ...

import { AuthGuardService } from './shared/services/auth-guard.service';
import { SignupComponent } from './signup/signup.component';
import { ProfilComponent } from './profil/profil.component';
import { ObservationComponent } from './observation/observation.component';
import { AuthResolver } from './shared/resolvers/auth.resolver';
import { ObservationResolver } from './shared/resolvers/observation.resolver';
import { ObservationFormComponent } from './observation-form/observation-form.component';
import { MemberComponent } from './member/member.component';

export const router: Routes = [
    { path: '',
        children: [
            { path: '', redirectTo: 'profil', pathMatch: 'full' },
            { path: 'profil', component: ProfilComponent },
            { path: 'membres', component: MemberComponent, resolve: { authInfo: AuthResolver }, canActivate: [AdminGuardService]},
            { 
              path: 'observations',
              component: ObservationComponent
            },
            { path: 'observations/ajouter', component: ObservationFormComponent},
            { path: 'observations/:key',
              children: [
                { 
                  path: 'editer',
                  component: ObservationFormComponent,
                  resolve: { 
                    observation: ObservationResolver,
                    authInfo: AuthResolver
                  }
                }
              ]
            }
        ],
        canActivate: [AuthGuardService],
        resolve: { authInfo: AuthResolver }
    },
    { path: 'connexion', component: LoginComponent },
    { path: 'enregistrement', component: SignupComponent },
    { path: '**', redirectTo: 'connexion' }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);