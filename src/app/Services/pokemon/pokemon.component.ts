import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pokemon } from '../../Types/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  /**
   * @param limit The number of Pokemons to fetch.
   * @param offset The starting offset for the list.
   * @returns An Observable array of Pokemon objects.
   */
  getPokemons(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`).pipe(
      map(response => response.results),
      switchMap(pokemonList => {
        // If the list is empty, return an empty array immediately.
        if (!pokemonList || pokemonList.length === 0) {
          return of([]);
        }

        const detailedRequests: Observable<Pokemon>[] = pokemonList.map((pokemon: any) =>
          this.http.get<any>(pokemon.url).pipe(
            switchMap(detail =>
              this.http.get<any>(`${this.baseUrl}/pokemon-species/${detail.id}`).pipe(
                map(speciesData => {
                  // Prioritize Portuguese description, fall back to English if not found
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

  /**
   * Retrieves detailed information for a single Pokemon.
   * @param id The ID or name of the Pokemon.
   * @returns An Observable of a single Pokemon object.
   */
  getPokemonDetails(id: string | number): Observable<Pokemon> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${id}`).pipe(
      switchMap((data) =>
        this.http.get<any>(`${this.baseUrl}/pokemon-species/${id}`).pipe(
          map((speciesData) => {
            // Prioritize Portuguese description, fall back to English if not found
            const flavorTextEntry =
              speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'pt') ||
              speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');

            return this.transformPokemonData(data, flavorTextEntry?.flavor_text || 'Description unavailable');
          })
        )
      )
    );
  }

  /**
   * Transforms raw Pokemon API data into the custom Pokemon interface.
   * @param data The raw Pokemon data from the API.
   * @param description The extracted flavor text description.
   * @returns A formatted Pokemon object.
   */
  private transformPokemonData(data: any, description: string): Pokemon {
    const types = data.types.map((typeInfo: any) => typeInfo.type.name);

    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      type: types.map((type: string) => type.charAt(0).toUpperCase() + type.slice(1)).join('/'),
      types: types,
      description: description.replace(/\n|\f/g, ' '), // Cleans newlines and form feeds from description
      imageUrl: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      level: Math.floor(Math.random() * 100) + 1,
      height: data.height / 10, // Convert decimetres to meters
      weight: data.weight / 10, // Convert hectograms to kilograms
    };
  }
}