import { UserService } from '../../services/user.service';
import { BehaviorSubject } from 'rxjs/Rx';
import { ObservationService } from '../../services/observation.service';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { OnChanges } from '@angular/core';
import { AfterViewChecked } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';

import { IColumn } from '../../interfaces/column';
import { IObservation } from '../../interfaces/observation';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private showDialog: boolean = false;
  private selectedObservation;
  private observations: IObservation[];

  private _data = new BehaviorSubject<any[]>([]);

  @Output () delete = new EventEmitter();

  @Input () user;
  @Input () columns: IColumn;
  @Input ()
  set data (observations: IObservation[]) {
    this._data.next(observations);
  }

  get data (): IObservation[] { return this._data.getValue(); }

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.get(this.user.uid).subscribe((user) => {
      this.user = user[0];
    });

    this._data
        .subscribe(x => {
            this.observations = this.data;
        });
  }

  private openModalWithSelectedData (observation): void {
      this.showDialog = true;
      this.selectedObservation = observation;
  }

  public onDelete (key: string): void {
    this.delete.emit({ key: key });
  }
}
