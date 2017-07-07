import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { ObservationService } from './observation.service';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ObservationComponent } from '../../observation/observation.component';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) { }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | Promise<boolean>> {
    let user = this.afAuth.auth.currentUser;
        
    if (user) {
      return this.userService.getRole(user).map(userData => {
        let userRole = userData.role;

        return userRole === 'admin' ? true : this.router.navigate(['/']);
      })
    } else {
      return Observable.of({});
    }
  }
}