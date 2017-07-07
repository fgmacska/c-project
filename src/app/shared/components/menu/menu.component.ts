import { IUser } from '../../interfaces/user';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

interface IMenu {
  path?: string,
  page: string,
  children?: [{path: string, page: string}],
  admin?: boolean
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  private subscription;

  private authInfo = { role: 'admin' };
  private menus: IMenu[];
  private isLogginPage: boolean = false;

  @Input() isAdmin: boolean;
  @Input() currentUser: IUser;
  @Input() isOpen: boolean = false;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.menus = [
      { 
        page: 'Observations',
        children: [
          {
            path: 'observations',
            page: 'Liste'
          },
          {
            path: 'observations/ajouter',
            page: 'Ajouter'
          }
        ]
      },
      { path: 'profil', page: 'Profil' }
    ];
  }

  ngOnDestroy () {
    // this.subscription.unsubscribe();
  }

  private logout(): void {
      this.authService.logout();
  } 
}
