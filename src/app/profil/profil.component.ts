/**
 * @Component Profil
 * Delete Observation
 * Logout
 */

import { UserService } from '../shared/services/user.service';
import { IColumn } from '../shared/interfaces/column';
import { IObservation } from '../shared/interfaces/observation';
import { ObservationService } from '../shared/services/observation.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { fadeInAnimation } from '../shared/animations/fade-in.animation';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  animations: [fadeInAnimation()]  
})
export class ProfilComponent implements OnInit {
  private authInfo;
  private observations: IObservation[];
  private columns: IColumn[];
  private user;
  private observationsList: boolean = true;
  private message: string;

  constructor(
    private afAuth: AngularFireAuth,
    private observationService: ObservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    // @Resolver Get User information
    this.authInfo = this.activatedRoute.snapshot.data['authInfo'];

    // @Observable get all observation of current user
    this.observationService
        .getObservationsFromCurrentUser(this.authInfo.uid)
        .subscribe((observations: IObservation[]) => {
          this.observations = observations 
        });

    // Init table
    this.columns = [
      {
          field: 'date',
          header: 'Date',
          sortable: true
      },
      {
          field: 'place', 
          header: 'Lieu',
          sortable: true,
          filter: true
      },
      {
          field: 'group', 
          header: 'Groupe',
          sortable: true,
          filter: true
      },
      {
          field: 'specie', 
          header: 'Espéce',
          sortable: true,
          filter: true
      },
      {
          field: 'count', 
          header: 'Nombre',
          sortable: true
      }
    ];
  }

  // LogOut
  private logout () {
    this.afAuth.auth.signOut();
    this.router.navigateByUrl('/connexion');
  }

  /**
   * Delete observation
   * @param event 
   */
  public handleDelete (event) {
    if (event.key) {
      this.observationService.delete(event.key).then(_ => {
        this.message = "L'observation a été supprimée";
        
        setTimeout(() => {
          this.message = "";
        }, 4000);
      });
    }
  }
}
