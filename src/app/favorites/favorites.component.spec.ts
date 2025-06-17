// src/app/favorites/favorites.component.spec.ts

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { RouterTestingModule } from '@angular/router/testing'; // Adicionado RouterTestingModule

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FavoritesComponent, // Componente standalone que está sendo testado
        RouterTestingModule // Incluído para fornecer as dependências de roteamento
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});