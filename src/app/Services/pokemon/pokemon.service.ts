import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Pokemon } from '../../Types/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemons(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`).pipe(
      map(response => response.results),
      switchMap(pokemonList => {
        if (!pokemonList || pokemonList.length === 0) {
          return of([]);
        }

        const detailedRequests: Observable<Pokemon>[] = pokemonList.map((pokemon: any) =>
          this.http.get<any>(pokemon.url).pipe(
            switchMap(detail =>
              this.http.get<any>(`${this.baseUrl}/pokemon-species/${detail.id}`).pipe(
                map(speciesData => {
                  const flavorTextEntry =
                    speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'pt') ||
                    speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');

                  return this.transformPokemonData(detail, flavorTextEntry?.flavor_text || 'Description unavailable');
                })
              )
            )
          )
        );

        return forkJoin(detailedRequests);
      })
    );
  }

  getPokemonDetails(id: string | number): Observable<Pokemon> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${id}`).pipe(
      switchMap((data) =>
        this.http.get<any>(`${this.baseUrl}/pokemon-species/${id}`).pipe(
          map((speciesData) => {
            const flavorTextEntry =
              speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'pt') ||
              speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');

            return this.transformPokemonData(data, flavorTextEntry?.flavor_text || 'Description unavailable');
          })
        )
      )
    );
  }

  private transformPokemonData(data: any, description: string): Pokemon {
    const types = data.types.map((typeInfo: any) => typeInfo.type.name);

    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      type: types.map((type: string) => type.charAt(0).toUpperCase() + type.slice(1)).join('/'),
      types: types,
      description: description.replace(/\n|\f/g, ' '),
      imageUrl: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      level: Math.floor(Math.random() * 100) + 1,
      height: data.height / 10,
      weight: data.weight / 10,
    };
  }
}