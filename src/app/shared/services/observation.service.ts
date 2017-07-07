import { FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Rx';
import { IObservation } from '../interfaces/observation';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ObservationService {

  constructor(
    private af: AngularFireDatabase
  ) { }

  public all (): FirebaseListObservable<IObservation[]> {
    return this.af.list('/observations');
  }

  public findObservationByUrl (key: string): FirebaseObjectObservable<IObservation> {
    return this.af.object(`/observations/${key}`);
  }

  public getObservationsFromCurrentUser (uid: string): FirebaseListObservable<IObservation[]> {
    return this.af.list('/observations', {
      query: {
        orderByChild: 'creator/uid',
        equalTo: uid
      }
    });
  }

  public update (key: string, data: IObservation): firebase.Promise<void> {
    return this.af.list('/observations').update(key, data);
  }

  public save (data: IObservation, key?: string): firebase.Promise<void> {
    if (key) {
      return this.af.list('/observations').update(key, data);
    }

    return this.af.list('/observations').push(data);
  }

  public delete (object): firebase.Promise<any> {
    return this.af.list('/observations').remove(object);
  }

  private handleErrors (error: Response) {
    return Observable.throw(error);
  }

}
