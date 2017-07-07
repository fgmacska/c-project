import { UserService } from './shared/services/user.service';
import { AuthService } from './shared/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from './shared/animations/fade-in.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInAnimation()]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app works!';
  private isOpen: boolean = false;
  private isLoginPage: boolean = false;
  private subscription;
  private currentUser;
  private isAdmin;

  constructor (private location: Location, private router: Router, private authService: AuthService, private userService: UserService) {}

  ngOnInit () {
    this.router.events.subscribe((route) => {
      if (this.location.path() !== '/connexion') {
        this.isLoginPage = true;
      } else {
        this.isLoginPage = false;
      }
    });

    this.subscription = this.authService.getAuthInfo().authState.subscribe(user => {  
      if (user) {
        this.currentUser = user;
        this.subscription = this.userService.get(user.uid).take(1).subscribe((currentUser) => {
          if (currentUser[0].role === 'admin') this.isAdmin = true;
        });
      }  
    });
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }

  private toggleMenu () {
    this.isOpen = !this.isOpen;
  }
}
