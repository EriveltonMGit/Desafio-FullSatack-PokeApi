// src/app/home/home.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PokemonService } from '../Services/pokemon/pokemon.service'; // Verifique o caminho correto
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let pokemonService: PokemonService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule.withRoutes([]), // Para simular roteamento
        HttpClientTestingModule // Para simular requisições HTTP do serviço
      ],
      providers: [
        PokemonService // Forneça o serviço real ou um mock aqui
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(PokemonService);
    router = TestBed.inject(Router);
    // NÃO CHAME fixture.detectChanges() AQUI GLOBALMENTE.
    // Isso é feito em cada teste onde o ngOnInit precisa ser acionado após configurar spies.
  });

  it('should create', () => {
    // Para este teste simples, o ngOnInit será chamado.
    // O PokemonService será chamado, mas não há asserções sobre os dados.
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call loadPokemons on ngOnInit', () => {
    // Configura o spy ANTES que ngOnInit seja chamado
    const getPokemonsSpy = spyOn(pokemonService, 'getPokemons').and.returnValue(of([]));

    fixture.detectChanges(); // Dispara ngOnInit e, consequentemente, loadPokemons

    expect(getPokemonsSpy).toHaveBeenCalled();
  });

  it('should load initial pokemons', (done) => {
    const mockPokemons = [{
      id: 1, name: 'Bulbasaur', type: 'Grass/Poison', types: ['grass', 'poison'],
      description: '', imageUrl: '', level: 10, height: 0.7, weight: 6.9
    }];

    // Mock da resposta do serviço para este teste
    spyOn(pokemonService, 'getPokemons').and.returnValue(of(mockPokemons));

    fixture.detectChanges(); // Dispara ngOnInit que chama loadPokemons

    fixture.whenStable().then(() => {
      expect(component.pokemons.length).toBe(1);
      expect(component.pokemons[0].name).toBe('Bulbasaur');
      expect(component.currentPage).toBe(1);
      expect(component.isLoading).toBeFalse();
      expect(component.allPokemonsLoaded).toBeFalse();
      done();
    });
  });

  it('should append more pokemons when loadPokemons is called again', (done) => {
    const initialPokemons = [{
      id: 1, name: 'Bulbasaur', type: 'Grass/Poison', types: ['grass', 'poison'],
      description: '', imageUrl: '', level: 10, height: 0.7, weight: 6.9
    }];
    const morePokemons = [{
      id: 2, name: 'Ivysaur', type: 'Grass/Poison', types: ['grass', 'poison'],
      description: '', imageUrl: '', level: 20, height: 1.0, weight: 13.0
    }];

    // Mock da primeira chamada para o ngOnInit (ou primeira chamada explícita)
    const getPokemonsSpy = spyOn(pokemonService, 'getPokemons')
      .and.returnValue(of(initialPokemons));

    fixture.detectChanges(); // Aciona ngOnInit e a primeira carga de pokemons

    fixture.whenStable().then(() => {
      // Verifica o estado após a primeira carga
      expect(component.pokemons.length).toBe(1);
      expect(component.currentPage).toBe(1);

      // Re-mock da segunda chamada
      getPokemonsSpy.and.returnValue(of(morePokemons));
      component.loadPokemons(); // Chama para carregar mais

      fixture.whenStable().then(() => {
        expect(component.pokemons.length).toBe(2);
        expect(component.pokemons[1].name).toBe('Ivysaur');
        expect(component.currentPage).toBe(2);
        expect(component.isLoading).toBeFalse();
        done();
      });
    });
  });

  it('should set allPokemonsLoaded to true when no more pokemons are returned', (done) => {
    // Mock para retornar uma lista vazia
    spyOn(pokemonService, 'getPokemons').and.returnValue(of([]));

    // Assegura que o componente começa com um estado limpo antes deste teste específico
    component.pokemons = [];
    component.currentPage = 0;

    component.loadPokemons(); // Chama o método que queremos testar

    fixture.whenStable().then(() => {
      expect(component.pokemons.length).toBe(0);
      expect(component.allPokemonsLoaded).toBeTrue();
      expect(component.isLoading).toBeFalse();
      done();
    });
  });

  it('should handle error when loading pokemons', (done) => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(pokemonService, 'getPokemons').and.returnValue(throwError(() => new Error('API Error')));

    component.loadPokemons();

    fixture.whenStable().then(() => {
      // Força a detecção de mudanças para garantir que o estado `isLoading` seja atualizado no fixture
      fixture.detectChanges();
      expect(component.isLoading).toBeFalse();
      expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar Pokémons:', jasmine.any(Error));
      done();
    }).catch(err => {
      fail('Teste falhou com erro inesperado no whenStable: ' + err);
      done();
    });
  });

  it('should navigate to details page when viewPokemonDetails is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const pokemonId = 123;
    component.viewPokemonDetails(pokemonId);
    expect(navigateSpy).toHaveBeenCalledWith(['/tabs/details', pokemonId]);
  });

  it('should unsubscribe from pokemonSubscription on ngOnDestroy', () => {
    const mockSubscription = { unsubscribe: () => { } } as any;
    const unsubscribeSpy = spyOn(mockSubscription, 'unsubscribe');

    // Simula que o componente tem uma subscription ativa
    component['pokemonSubscription'] = mockSubscription;

    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});