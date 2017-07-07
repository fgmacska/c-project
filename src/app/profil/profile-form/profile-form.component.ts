/**
 * @Component Profile form
 * Update name
 * Update mail
 * Update password
 */

import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { ValidationErrors } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {

  private nameForm: FormGroup;
  private passwordForm: FormGroup;
  private emailForm    : FormGroup;
  private oldPasswordForm: FormGroup;

  private authInfo;

  private errors: boolean;

  private isValid: boolean = true;
  defaultPhoto: string = 'http://polithec.fr/wordpress/wp-content/uploads/2016/01/mr-nobody.png';
  private onPasswordRequest: boolean;
  private onProfileRequest: boolean;
  private message: {type: string, text: string};
  private userInfo;
  public authState: AngularFireAuth;
  private notMatching: boolean = false;
  private showDialog: boolean = false;

  private successMessage: string;
  private errorMessage: string;

  @Input() currentUser;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private auth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    // @Resolver Get user info from UserResolver
    this.authInfo = this.activatedRoute.snapshot.data['authInfo'];

    const current = {
      name: this.authInfo.displayName,
      email: this.authInfo.email,
      photoURL: ''
    }

    this.buildForm();

    (<FormGroup>this.nameForm).patchValue(current, { onlySelf: true });
    (<FormGroup>this.emailForm).patchValue(current, { onlySelf: true });
  }

  private buildForm () {
    this.nameForm = this.formBuilder.group({
      name: ['', []]
    });

     this.emailForm = this.formBuilder.group({
        email: ['', []]
    });
    
    this.oldPasswordForm = this.formBuilder.group({
        oldPassword: ['', []]
    });

    this.passwordForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }

  private matchingPasswords(passwordKey: string, confirmPasswordKey: string){
    return (group: FormGroup): {[key: string]: any} => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value && confirmPassword.value) {
            if(password.value !== confirmPassword.value){
                this.notMatching = true;
                return {
                    mismatchedPasswords: true
                }
            } else {
                this.notMatching = false;
                this.displayMessage('success', 'Le mot de passe correspond !');   
            }
        }
      }
  }

  /**
   * @Promise to update password after checking credentials 
   * @param oldPassword 
   * @return boolean
   */
  private onUpdateWithOldPassword (oldPassword) {
    if (this.oldPasswordForm.value.oldPassword) {
        this.auth.authState.take(1).subscribe(user => {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, this.oldPasswordForm.value.oldPassword);
            user.reauthenticateWithCredential(credential).then(() => {
                this.onPasswordRequest = true;
                if(this.passwordForm.valid){
                    this.authInfo
                        .updatePassword(this.passwordForm.value.password)
                        .then(() => {
                            this.onProfileRequest = false;
                            this.displayMessage('success', this.successMessage);
                            return false;
                        })
                        .catch(() => {
                            this.onProfileRequest = false;
                            this.displayMessage('error', 'Oups ! Une erreur est survenue');   
                            return false;
                        });
                
                    this.passwordForm.reset();
                    this.oldPasswordForm.reset();
                
                    return false;
                } else if (this.emailForm.valid) {
                    this.authInfo.updateEmail(this.emailForm.value.email)
                        .then(() => {
                            this.userService.updateOnlyEmail(this.authInfo.uid, this.emailForm.value.email)
                        })
                        .then(() => {
                            this.onProfileRequest = false;
                            this.displayMessage('success', this.successMessage);
                            return false;
                        })
                        .catch(() => {
                            this.onProfileRequest = false;
                            this.displayMessage('error', 'Oups ! Une erreur est survenue');
                            return false;
                        });

                    this.oldPasswordForm.reset();
                    return false;
                }
            }).catch(() => {
                this.onProfileRequest = false;
                this.displayMessage('error', this.errorMessage);   
                return false;
            });
        });
        this.showDialog = false;
        return false;
    } else {
        this.showDialog = true;
        return false;
    }

  }

  private onUpdatePassword(password){
    this.showDialog = true;
    this.successMessage = 'Le mot de passe a discrétement été mis à jour';
    this.errorMessage = 'L\'ancien mot de passe ne semble pas correct';
    return false;
  }

  /**
   * @Promise Update name
   * @param profile IUser
   */
  private onUpdateName(profile){

    this.onProfileRequest = true;

    if (profile.valid) {
        this.authInfo.updateProfile({
            displayName: profile.value.name,
            photoURL: ''
        }).then(() => {
            this.userService.updateOnlyName(this.authInfo.uid, this.nameForm.value.name)
            this.onProfileRequest = false;
            this.displayMessage('success', 'Ok ! Le nom a bien été mis à jour');
        });
    } else {
        this.onProfileRequest = false;
        this.displayMessage('error', 'Oups ! Une erreur est survenue');
    }
  }

  private onUpdateEmail () {
    this.showDialog = true;
    this.successMessage = 'L\'email a été mis à jour';
    this.errorMessage = 'L\'ancien mot de passe ne semble pas correct';
    return false;
  }
  
  private displayMessage (type, message) {
    this.message = {
        type: type,
        text: message
    }

    setTimeout (() => {
        this.message = null;
    }, 3500); 
  }
}