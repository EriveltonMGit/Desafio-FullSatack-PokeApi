// src/app/Services/pokemon/pokemon.component.spec.ts
// OU src/app/services/pokemon.service.spec.ts (se o nome do seu serviço mudou para pokemon.service.ts)

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.component'; // Garanta que este caminho está correto para o seu serviço
import { Pokemon } from '../../Types/pokemon'; // Garanta que este caminho está correto para a sua interface Pokemon

describe('PokemonService', () => { // O 'describe' deve ser para o SERVIÇO, não 'PokemonComponent'
  let service: PokemonService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // APENAS MÓDULOS DE TESTE VÃO EM 'imports'
      providers: [PokemonService] // SEU SERVIÇO VAI AQUI, EM 'providers'
    });

    // Como instanciar um SERVIÇO para teste:
    service = TestBed.inject(PokemonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Garante que todas as requisições mockadas foram manipuladas
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of pokemons', (done) => {
    const mockPokemonListResponse = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }
      ]
    };

    const mockBulbasaurDetails = {
      id: 1,
      name: 'bulbasaur',
      sprites: { other: { 'official-artwork': { front_default: 'bulbasaur.png' } }, front_default: 'bulbasaur_default.png' },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      height: 7,
      weight: 69
    };

    const mockCharmanderDetails = {
      id: 4,
      name: 'charmander',
      sprites: { other: { 'official-artwork': { front_default: 'charmander.png' } }, front_default: 'charmander_default.png' },
      types: [{ type: { name: 'fire' } }],
      height: 6,
      weight: 85
    };

    service.getPokemons(2, 0).subscribe((pokemons: Pokemon[]) => {
      expect(pokemons.length).toBe(2);
      expect(pokemons[0].name).toBe('Bulbasaur');
      expect(pokemons[0].type).toBe('Grass/Poison');
      expect(pokemons[0].imageUrl).toBe('bulbasaur.png');
      expect(pokemons[1].name).toBe('Charmander');
      expect(pokemons[1].type).toBe('Fire');
      expect(pokemons[1].imageUrl).toBe('charmander.png');
      done();
    });

    const reqList = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon?limit=2&offset=0');
    expect(reqList.request.method).toBe('GET');
    reqList.flush(mockPokemonListResponse);

    const reqBulbasaur = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon/1/');
    expect(reqBulbasaur.request.method).toBe('GET');
    reqBulbasaur.flush(mockBulbasaurDetails);

    const reqCharmander = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon/4/');
    expect(reqCharmander.request.method).toBe('GET');
    reqCharmander.flush(mockCharmanderDetails);
  });

  it('should return an empty array if no pokemons are found', (done) => {
    const mockEmptyListResponse = { results: [] };

    service.getPokemons(1, 0).subscribe((pokemons: Pokemon[]) => {
      expect(pokemons.length).toBe(0);
      expect(pokemons).toEqual([]);
      done();
    });

    const req = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon?limit=1&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmptyListResponse);
  });

  it('should retrieve details for a single pokemon', (done) => {
    const mockPikachuDetails = {
      id: 25,
      name: 'pikachu',
      sprites: { other: { 'official-artwork': { front_default: 'pikachu.png' } }, front_default: 'pikachu_default.png' },
      types: [{ type: { name: 'electric' } }],
      height: 4,
      weight: 60
    };

    service.getPokemonDetails(25).subscribe((pokemon: Pokemon) => {
      expect(pokemon).toBeTruthy();
      expect(pokemon.id).toBe(25);
      expect(pokemon.name).toBe('Pikachu');
      expect(pokemon.type).toBe('Electric');
      expect(pokemon.imageUrl).toBe('pikachu.png');
      expect(pokemon.height).toBe(0.4);
      expect(pokemon.weight).toBe(6);
      done();
    });

    const req = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon/25');
    expect(req.request.method).toBe('GET');
    req.flush(mockPikachuDetails);
  });

  it('should handle error when retrieving pokemon details', (done) => {
    service.getPokemonDetails('invalid').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
        done();
      }
    });

    const req = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon/invalid');
    expect(req.request.method).toBe('GET');
    req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
  });
});