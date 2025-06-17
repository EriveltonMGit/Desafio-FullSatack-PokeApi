// src/app/components/main-header/main-header.component.spec.ts

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainHeaderComponent } from './main-header.component';
import { RouterTestingModule } from '@angular/router/testing'; 

describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MainHeaderComponent, // Componentes standalone vão em 'imports'
        RouterTestingModule // Necessário porque o componente importa RouterModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});