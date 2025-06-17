// src/app/services/favorite/favorite.service.ts
import { Injectable } from '@angular/core';
import { Pokemon } from '../../Types/pokemon';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly FAVORITES_KEY = 'pokemon_favorites';
  private _favorites: BehaviorSubject<Pokemon[]> = new BehaviorSubject<Pokemon[]>([]);
  public readonly favorites$: Observable<Pokemon[]> = this._favorites.asObservable();

  constructor() {
    this.loadFavoritesFromLocalStorage();
  }

  private loadFavoritesFromLocalStorage() {
    try {
      const favoritesString = localStorage.getItem(this.FAVORITES_KEY);
      if (favoritesString) {
        const favorites: Pokemon[] = JSON.parse(favoritesString);
        this._favorites.next(favorites);
      }
    } catch (e) {
      console.error('Error loading favorites from local storage', e);
    }
  }

  private saveFavoritesToLocalStorage(favorites: Pokemon[]) {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites to local storage', e);
    }
  }

  /**
   * Adiciona um Pokémon aos favoritos.
   * Se já estiver na lista, não faz nada.
   * @param pokemon O Pokémon a ser adicionado.
   */
  addFavorite(pokemon: Pokemon): void {
    const currentFavorites = this._favorites.getValue();
    if (!currentFavorites.some(fav => fav.id === pokemon.id)) {
      const updatedFavorites = [...currentFavorites, pokemon];
      this._favorites.next(updatedFavorites);
      this.saveFavoritesToLocalStorage(updatedFavorites);
      console.log(`Pokemon ${pokemon.name} added to favorites.`);
    } else {
      console.log(`Pokemon ${pokemon.name} is already in favorites.`);
    }
  }

  /**
   * Remove um Pokémon dos favoritos.
   * @param pokemonId O ID do Pokémon a ser removido.
   */
  removeFavorite(pokemonId: number): void {
    const currentFavorites = this._favorites.getValue();
    const updatedFavorites = currentFavorites.filter(fav => fav.id !== pokemonId);
    if (updatedFavorites.length < currentFavorites.length) {
      this._favorites.next(updatedFavorites);
      this.saveFavoritesToLocalStorage(updatedFavorites);
      console.log(`Pokemon with ID ${pokemonId} removed from favorites.`);
    } else {
      console.log(`Pokemon with ID ${pokemonId} not found in favorites.`);
    }
  }

  /**
   * Verifica se um Pokémon está nos favoritos.
   * @param pokemonId O ID do Pokémon a ser verificado.
   * @returns true se o Pokémon estiver nos favoritos, false caso contrário.
   */
  isFavorite(pokemonId: number): boolean {
    return this._favorites.getValue().some(fav => fav.id === pokemonId);
  }

  /**
   * Retorna a lista atual de Pokémons favoritos.
   * @returns Um array de Pokémons favoritos.
   */
  getFavorites(): Pokemon[] {
    return this._favorites.getValue();
  }
}