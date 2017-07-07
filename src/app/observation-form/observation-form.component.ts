/**
 * @Component ObservationForm
 * Form logic to add and update Observation
 * Save on Edit
 * Save on Create
 */

import { ObservationService } from '../shared/services/observation.service';
import { ValidationErrors } from '@angular/forms';
import { IObservation } from '../shared/interfaces/observation';
import { 
    Component,
    OnInit,
    Input,
    ElementRef,
    OnDestroy,
    ViewChild
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { 
    FormGroup, 
    FormControl, 
    Validators,     
    FormBuilder 
} from '@angular/forms';
import * as moment from 'moment';
import { fadeInAnimation } from '../shared/animations/fade-in.animation';

declare var jQuery: any;

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.css'],
  animations: [fadeInAnimation()]
})
export class ObservationFormComponent implements OnInit {
  private observation: IObservation;
  private authInfo;
  private observationForm: FormGroup;
  private submitted: boolean;
  private events: any[] = [];
  private key: string;
  private message: string;

  private isSuccess: boolean;
  private isError: boolean;

  private btnText: string = 'Publier';

  @ViewChild('datepicker') input;

  private active = true;
  private pickadateParams: any[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private observationService: ObservationService,
    private elementRef: ElementRef
  ){}

  ngOnInit():void {
    /*
    * @Resolver
    *   - Get observation on update
    *   - Get user info
    */
    this.observation = this.activatedRoute.snapshot.data['observation'];
    this.authInfo    = this.activatedRoute.snapshot.data['authInfo'];

    if (this.observation) this.btnText = 'Modifier';

    this.buildForm();  

    (<FormGroup>this.observationForm).patchValue(this.observation ? this.observation : [], { onlySelf: true });

    // Init datepicker
    this.pickadateParams = [
        {
            selectMonths: true,
            selectYears: 17,
            labelMonthNext: 'Suivant',
            labelMonthPrev: 'Précédent',
            labelMonthSelect: 'Mois',
            labelYearSelect: 'Année',
            monthsFull: [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ],
            monthShort: [
                'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Jui', 'Aout', 'Sep', 'Oct', 'Nov', 'Déc'
            ],
            weekdaysFull: [
                'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
            ],
            weekdaysShort: [
                'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'
            ],
            weekdaysLetter: [
                'L', 'M', 'Me', 'J', 'V', 'S', 'D'
            ],
            clear: 'X',
            today: 'Auj.',
            close: 'OK',
            format: 'dd/mm/yyyy'
        }
    ]; 
  }

  ngAfterViewInit () {
    // Instantiate pickadate
    jQuery(this.input.nativeElement).pickadate({});
  }

  // Init errors
  formErrors: Object = {
    date: '',
    place: '',
    gps: '',
    group: '',
    specie: '',
    count: '',
    meteo: '',
  }

  // Init Error validation message
  validationMessages: Object = {
    date: {
      required: 'Il manque la date'
    },
    place: {
      required: 'Il manque le lieu'
    },
    gps: {
      required: 'Les coodonnées doivent être de type DMS'
    },
    group: {
      required: 'De quel groupe s\'agit-il ?'
    },
    specie: {
      required: 'L\'espèce est requise !'
    },
    count: {
      required: 'Il y en avait combien ?'
    },
    meteo: {
      required: 'Quel temps faisait-il ?'
    }
  }

  /**
   * Display observation on edit
   * @param data any
   */
  private onValueChanged(data?: any) {
    if (!this.observationForm) { return; }
    
    const form = this.observationForm;
  
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
  
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  /**
   * @Observable Save on update or on create
   * @param model IObservation
   * @param isValid Boolean 
   */
  private save (model: IObservation, isValid: boolean) {
    this.submitted = true;
    let currentDate:string = moment().format('Do MMMM YYYY, h:mm');
    let message: string = "L'observation a été ajoutée";

    if (isValid) {
      let data = Object.assign(
        model,
        {
          dateUpdated: currentDate,
          creator: {
            uid: this.authInfo.uid,
            name: this.authInfo.displayName
          }
        }
      );
    
      if (this.observation) {
        this.key = this.observation['$key'];
        message = "L'observation a été modifiée";
      }

      this.observationService.save(data, this.key).then(_ => { 
        this.isSuccess = true;
        this.message = message;
        
        setTimeout(() => {
          this.message = "";
        }, 3000)

        if (!this.key) this.observationForm.reset();
        
      }).catch(_ => { this.isError = true; this.message = "L'observation n'a pas pu être ajoutée" });
    }
  }
  
  // Init and populate form
  private buildForm():void {
    this.observationForm = this.formBuilder.group({
      date: ['', [Validators.required]],
      place: ['', [Validators.required]],
      gps: ['', []],
      group: ['', [Validators.required]],
      specie: ['', [Validators.required]],
      count: ['', [Validators.required]],
      note: ['', []],
      meteo: ['', [Validators.required]]
    });

    this.observationForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
}