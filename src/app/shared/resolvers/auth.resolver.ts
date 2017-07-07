import { RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthResolver implements Resolve<any> {

    constructor(private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      return this.authService.getAuthInfo().auth.currentUser;
    }
}