import {
  trigger,
  animate,
  transition,
  style,
  state
} from '@angular/animations';

export const slidingDoorAnimation = trigger('slidingDoorAnimation', 
  [
    state('in', 
      style({ width: '{{ inWidth }}', overflow:'hidden'}),
      { params: { inWidth: '250px'}}
    ),
    state('out', 
      style({ width: '{{ outWidth }}'}),
      { params: { outWidth: '*'}}
    ),
    transition('* <=> *',animate('{{ time }}'))
  ]
);