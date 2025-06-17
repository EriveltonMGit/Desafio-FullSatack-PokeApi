// src/app/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MainHeaderComponent } from "../components/main-header/main-header.component";

import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonProgressBar,
  IonSpinner,
  ToastController,
  IonIcon // <-- ADD THIS IMPORT
} from "@ionic/angular/standalone";

import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';

import { Pokemon } from '../Types/pokemon';
import { PokemonService } from '../Services/pokemon/pokemon.service';
import { FavoriteService } from '../Services/favorites/favorite.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonButton,
    IonCardContent,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    MainHeaderComponent,
    IonProgressBar,
    HttpClientModule,
    IonSpinner,
    IonIcon // <-- AND ADD IT HERE IN THE IMPORTS ARRAY
  ],
  providers: [PokemonService]
})
export class HomeComponent implements OnInit, OnDestroy {

  pokemons: Pokemon[] = [];
  currentPage: number = 0;
  pokemonsPerPage: number = 20;
  isLoading: boolean = false;
  allPokemonsLoaded: boolean = false;

  private pokemonSubscription: Subscription | undefined;
  private favoritesSubscription: Subscription | undefined;
  favoritePokemonIds: Set<number> = new Set();

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService,
    private toastController: ToastController
  ) {
    addIcons({ star, starOutline });
  }

  ngOnInit() {
    this.loadPokemons();
    this.subscribeToFavorites();
  }

  ngOnDestroy() {
    if (this.pokemonSubscription) {
      this.pokemonSubscription.unsubscribe();
    }
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  loadPokemons() {
    if (this.isLoading || this.allPokemonsLoaded) {
      return;
    }

    this.isLoading = true;
    const offset = this.currentPage * this.pokemonsPerPage;

    this.pokemonSubscription = this.pokemonService.getPokemons(this.pokemonsPerPage, offset).subscribe({
      next: (newPokemons: Pokemon[]) => {
        if (newPokemons.length > 0) {
          this.pokemons = [...this.pokemons, ...newPokemons];
          this.currentPage++;
          console.log('Pokemons loaded:', this.pokemons);
        } else {
          this.allPokemonsLoaded = true;
          console.log('All Pokemons have been loaded.');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Pokemons:', error);
        this.isLoading = false;
      }
    });
  }

  private subscribeToFavorites(): void {
    this.favoritesSubscription = this.favoriteService.favorites$.subscribe(favorites => {
      this.favoritePokemonIds = new Set(favorites.map(fav => fav.id));
    });
  }

  async toggleFavorite(pokemon: Pokemon) {
    if (this.favoriteService.isFavorite(pokemon.id)) {
      this.favoriteService.removeFavorite(pokemon.id);
      await this.presentToast(`${pokemon.name} removido dos favoritos!`, 'danger');
    } else {
      this.favoriteService.addFavorite(pokemon);
      await this.presentToast(`${pokemon.name} adicionado aos favoritos!`, 'success');
    }
  }

  isPokemonFavorite(pokemonId: number): boolean {
    return this.favoriteService.isFavorite(pokemonId);
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    toast.present();
  }

  viewPokemonDetails(pokemonId: number) {
    console.log('Clicked Details for Pokemon ID:', pokemonId);
    this.router.navigate(['/tabs/details', pokemonId]);
  }
}