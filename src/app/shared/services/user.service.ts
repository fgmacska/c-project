import { Observable, Subscription } from 'rxjs/Rx';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable, Inject } from '@angular/core';
import { IUser } from '../interfaces/user';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class UserService {

  private storageRef;

  constructor(
    private af: AngularFireDatabase,
      @Inject(FirebaseApp) firebaseApp: firebase.app.App
  ) {
      this.storageRef = firebaseApp.database()
                                    .ref('/users');}

  public all (): FirebaseListObservable<IUser[]> {
    return this.af.list(`/users`);   
  }

  public get (uid: string): FirebaseListObservable<IUser[]> {
    return this.af.list('/users', {
      query: {
        orderByChild: 'uid',
        equalTo: uid
      }
    })
  }

  public getRole (user) {
    return this.af.object(`/users/${user.uid}`);
  }

  public getUserByEmail (email: string): FirebaseListObservable<IUser[]> {
    return this.af.list('/users', {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    });
  }

  public create(newUser): firebase.Promise<any> {
    console.log('newuser', newUser);
      return this.storageRef
                  .child(newUser.uid)  
                  .set(newUser);
  }

  public updateOnlyEmail(uid, email): firebase.Promise<any> {
    return this.af
                .object(`/users/${uid}/email`)
                .set(email);
  }

  public updateOnlyName(uid, name): firebase.Promise<any> {
    return this.af
                .object(`/users/${uid}/name`)
                .set(name);
  }

  public delete (user): firebase.Promise<any> {
    return this.af
                .object(`/users/${user.key}`)
                .update(user);
  }

}