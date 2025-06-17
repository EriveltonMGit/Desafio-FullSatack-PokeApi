// src/app/main-details/main-details.component.spec.ts

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MainDetailsComponent } from './main-details.component';
import { RouterTestingModule } from '@angular/router/testing'; // Adicionado RouterTestingModule
import { MainHeaderComponent } from '../components/main-header/main-header.component'; // Importe o componente filho standalone

describe('MainDetailsComponent', () => {
  let component: MainDetailsComponent;
  let fixture: ComponentFixture<MainDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MainDetailsComponent, // Componente standalone que está sendo testado
        MainHeaderComponent, // Componente filho standalone importado
        RouterTestingModule // Necessário porque MainHeaderComponent usa roteamento
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});