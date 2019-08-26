import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tb-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})
export class ToggleComponent implements OnInit {
    private stateValue:boolean=false;

    @Input()
    get state(){ return this.stateValue;}
    
    @Output() stateChange = new EventEmitter();
    set state(val) {
      this.stateValue = val;
      this.stateChange.emit(this.stateValue);
    }

  constructor() { }

  ngOnInit(){
  }
  toggleMe(){
      console.log(`${this.state}`);
      this.state = !this.state;
      console.log(`${this.state}`);
  }
}
