import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainDetailsComponent } from './main-details.component';

describe('MainDetailsComponent', () => {
  let component: MainDetailsComponent;
  let fixture: ComponentFixture<MainDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MainDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
