/**
 * @Component member
 * Get users list
 * Deactivate user
 * Add user
 */

import { IUser } from '../shared/interfaces/user';
import { IObservation } from '../shared/interfaces/observation';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { fadeInAnimation } from '../shared/animations/fade-in.animation';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  animations: [fadeInAnimation()]
})
export class MemberComponent implements OnInit, OnDestroy {

  private subscription;
  private message: {type: string, text: string};

  private userForm: FormGroup;
  private usersList: IUser[];
  private currentUserUid: string = 'wz9k1CEvGPOPNhpaErZy5TJ6ILL2';

  private successMessage: string;
  private errorMessage: string;

  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Init Validator form
    this.userForm = this.formBuilder.group({
        email:    ['', Validators.required],
        name:     ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.getUsersList();
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

  // @Observable Get User list
  private getUsersList () {
    this.subscription = this.userService
        .all()
        .subscribe(users => {
            this.usersList = users;
        });
  }

  // @Observable deactivate user
  private onDelete(event):void {
    this.userService.delete({ key: event.key, deleted: event.deleted });
  }

  // @Promise add user after checking credentials
  public onAddingUser(credentials): void {
    if(credentials.valid){
          let newUser = {
             name: credentials.value.name,
             email: credentials.value.email,
             password: credentials.value.password
          };

          this.authService
              .registerUser(newUser)
              .then((userCreated) => {
                  let user = {
                      uid: userCreated.uid,
                      email: userCreated.email,
                      name: userCreated.name,
                      photoURL: userCreated.photoURL,
                      role: 'membre'
                  }
                  
                  this.userService
                      .create(user)
                      .then((user) => {
                          this.displayMessage('success', `Le membre ${user.name} a été ajouté`);  
                          this.userForm.reset();
                      })
                      .catch(() => {
                          this.displayMessage('success', `Le membre ${user.name} a été ajouté`);  
                          this.userForm.reset();
                      });
              }).catch(() => {
                  this.displayMessage('error', 'L\'utilisateur existe déjà');  
              });
      } else {
        this.displayMessage('error', 'Tous les champs sont obligatoires !');  
      }
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
