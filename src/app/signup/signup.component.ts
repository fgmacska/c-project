/**
 * @Component Signup
 * /!\ Remove this component
 */

import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {

  state: string = '';
  error: any;

  constructor(
    private af: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  private onbSubmit (formData) {
    if (formData.valid) {
      console.log(formData.value);
      this.afAuth.auth.createUserWithEmailAndPassword(
        formData.value.email,
        formData.value.password
      ).then(
        success => this.router.navigate(['/connexion'])
      ).catch(
        err => this.error = err
      )
    }
  }

}
