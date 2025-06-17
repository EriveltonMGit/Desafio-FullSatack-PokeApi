import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Pokemon } from '../../Types/pokemon';
import { catchError, tap } from 'rxjs/operators'; // Importe catchError

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  // Aponte para a porta do seu back-end na mesma máquina (localhost)
  private myBackendUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // No seu PokemonService, adicione um log para verificar a resposta:
getPokemons(limit: number = 20, offset: number = 0): Observable<Pokemon[]> {
  console.log(`Fetching pokemons from: ${this.myBackendUrl}/pokemons?limit=${limit}&offset=${offset}`);
  return this.http.get<Pokemon[]>(`${this.myBackendUrl}/pokemons?limit=${limit}&offset=${offset}`).pipe(
    tap(data => console.log('Received data:', data)), // Adicione esta linha
    catchError(error => {
      console.error('Erro ao buscar Pokémons do seu back-end:', error);
      return of([]);
    })
  );
}

  getPokemonDetails(id: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.myBackendUrl}/pokemon/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar detalhes do Pokémon ${id} do seu back-end:`, error);
        throw error;
      })
    );
  }
}