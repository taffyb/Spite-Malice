import {
  animation, trigger, 
  transition, animate, style, state
} from '@angular/animations';

export const CardAnimation = trigger('move', 
    [
     state('start', 
       style({ top: '{{ sTop }}', right:'{{sRight}}',position:'absolute'}),
       { params: { sTop: '0px',sRight:'0px'}}
     ),
     state('end', 
             style({ top: '{{ eTop }}', right:'{{eRight}}',position:'absolute'}),
             { params: { eTop: '0px',eRight:'0px'}}
     ),
     transition('* <=> *',animate('{{ time }}'))
   ]
 );