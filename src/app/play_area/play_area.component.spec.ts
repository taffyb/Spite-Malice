import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Play_areaComponent } from './play_area.component';

describe('Play_areaComponent', () => {
  let component: Play_areaComponent;
  let fixture: ComponentFixture<Play_areaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Play_areaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Play_areaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
