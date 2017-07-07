/**
 * @Component Observation
 * List of Observation
 * Delete Observation
 */

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { DoCheck } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ObservationService } from '../shared/services/observation.service';

import { IColumn } from '../shared/interfaces/column';
import { IObservation } from '../shared/interfaces/observation';
import { fadeInAnimation } from '../shared/animations/fade-in.animation';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css'],
  animations: [fadeInAnimation()]
})
export class ObservationComponent implements OnInit, OnDestroy {

  private subscription;

  private authInfo;
  private observations: IObservation[];
  private columns: IColumn[];
  private user;
  private message: string;
  private itemsList;

  constructor(
    private observationService: ObservationService,
    private userService: UserService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get User info from UserResolver
    this.authInfo = this.activatedRoute.snapshot.data['authInfo'];

    // Get user id info
    this.user = this.authInfo.uid;

    // @Observable Get all info from database about the current user
    this.subscription = this.userService.get(this.authInfo.uid).take(1).subscribe((currentUser) => {
      this.user = currentUser;
    });

    // @Observable Get all observations
    this.subscription = this.observationService
        .all()
        .subscribe(observations => { 
          this.itemsList = observations
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

  /**
   * @Observable delete observation on click Event
   * @param event
   */
  private handleDelete (event) {
    if (event.key) {
      this.observationService.delete(event.key).then((deleted) => {
        this.message = "L'observation a été supprimée";
        
        setTimeout(() => {
          this.message = "";
        }, 4000);
      });
    }
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}