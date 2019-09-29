import {
  trigger,
  animate,
  transition,
  style,
  state
} from '@angular/animations';

export const slidingCardAnimation = trigger('slidingCardAnimation', 
  [
    state('start', 
      style({position: 'fixed', top: '{{ sTop }}', left:'{{ sLeft }}'}),
      { params: { sTop: '250px',sLeft:''}}
    ),
    state('end', 
      style({ top: '{{ eTop }}', left:'{{ eLeft }}'}),
      { params: { eTop: '250px',eLeft:''}}
    ),
    transition('* <=> *',animate('{{ time }}'))
  ]
);