import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { FB_CONFIG } from '../../config';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  constructor(
    private af: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router,
    @Inject(FirebaseApp) firebaseApp: firebase.app.App
  ) {
    
    // this.storage = firebaseApp.refe.ref.createUser
  }

  public getAuthInfo () {
    return this.afAuth;
  }

  public registerUser(newUser: { name: string, email: string, password: string }): any {
    let secondaryApp = firebase.initializeApp(FB_CONFIG, "App for creating user");

    return secondaryApp.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then(user => {
          user.updateProfile({
              displayName: newUser.name,
              photoURL: 'http://polithec.fr/wordpress/wp-content/uploads/2016/01/mr-nobody.png'
          }).catch((error) => {
              return 'Erreur lors de l\'ajout. Essaye à nouveau, si l\'erreur persiste, fais la remonter à l\'administrateur : ' + error;
          });
  
          let allUserInformation = { uid: user.uid, email: user.email, name: newUser.name, photoURL: 'http://polithec.fr/wordpress/wp-content/uploads/2016/01/mr-nobody.png' };
          
          secondaryApp.auth().signOut;

          return allUserInformation;
          
        });
        
  }

  public logout () {
    this.afAuth.auth.signOut();
    this.router.navigate(['/connexion'])
  }
}
