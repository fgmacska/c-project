import { ObservationService } from '../services/observation.service';
import { Observable } from 'rxjs/Rx';
import { RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ObservationResolver implements Resolve<any> {

    constructor (private observationService: ObservationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>{
      return this.observationService.findObservationByUrl(route.params['key']).first();
    }
}