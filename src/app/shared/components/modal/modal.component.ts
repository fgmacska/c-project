import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../../animations/fade-in.animation';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [fadeInAnimation()]
})
export class ModalComponent {
  @Input() closable: boolean = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() value;

  constructor() { }
}
