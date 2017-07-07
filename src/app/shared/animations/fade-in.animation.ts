import { trigger, state, animate, transition, style } from '@angular/animations';

export function fadeInAnimation(){
    return trigger('fadeInAnimation', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('.4s', style({ opacity: 1 }))
        ]),
        transition(':leave', [
            style({ opacity: 1 }),
            animate('.4s', style({ opacity: 0 }))
        ])
    ]);
}