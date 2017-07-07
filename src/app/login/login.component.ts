/**
 * @Component Login
 */

import { UserService } from '../shared/services/user.service';
import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { fadeInAnimation } from '../shared/animations/fade-in.animation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInAnimation()]
})
export class LoginComponent implements OnInit {
  
  state: string = '';
  error: any;

  constructor(
    private af: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl('/observations');
      }
    });
  }
  
  /**
   * @Observable check credentials and login
   * @param formData credentials email & password
   */
  private onSubmit (formData) {
    if (formData.valid) {
      this.userService.getUserByEmail(formData.value.email).first()
          .subscribe((user) => {
            if (user.length === 0) {
              this.error = 'Aucun compte';
            } else {
              console.log('existe');
              if (!user[0].deleted) {
                this.afAuth.auth.signInWithEmailAndPassword(formData.value.email, formData.value.password)
                  .then(
                    success => this.router.navigate(['/observations'])
                  ).catch(
                    err => {
                      this.error = 'Les identifiants sont erronés';
                      setTimeout(() => {
                        this.error = '';
                      }, 4000);
                    }
                  )
              } else {
                this.error = 'Votre compte a été désactivé. Veuillez contacter l\'administrateur';
                
                setTimeout(() => {
                  this.error = '';
                }, 4000);
              }
            }
          })
    }
  }

}
