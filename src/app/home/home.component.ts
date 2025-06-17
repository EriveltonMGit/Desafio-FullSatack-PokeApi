import { Component, OnInit } from '@angular/core';
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
  IonSpinner // Import IonSpinner for loading indicator
} from "@ionic/angular/standalone";

import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

import { Pokemon } from '../Types/pokemon';
import { PokemonService } from '../Services/pokemon/pokemon.component'; // Ensure path is correct
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs'; // Import Subscription to manage subscriptions

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
    IonSpinner
],
  providers: [PokemonService]
})
export class HomeComponent implements OnInit {

  pokemons: Pokemon[] = [];
  currentPage: number = 0; // Tracks the current page/offset
  pokemonsPerPage: number = 20; // Number of Pokemons to load per request (changed from 10 to 20)
  isLoading: boolean = false; // To show/hide loading spinner
  allPokemonsLoaded: boolean = false; // To disable "Load More" button when no more data

  private pokemonSubscription: Subscription | undefined; // To manage observable subscription

  constructor(
    private router: Router,
    private pokemonService: PokemonService
  ) {
    addIcons({ star });
  }

  ngOnInit() {
    this.loadPokemons(); // Load initial set of Pokemons
  }

  /**
   * Loads Pokemons from the API using the service, appending to the existing list.
   * Manages loading state and checks if all Pokemons have been loaded.
   */
  loadPokemons() {
    if (this.isLoading || this.allPokemonsLoaded) {
      return; // Prevent multiple simultaneous calls or calls when all data is loaded
    }

    this.isLoading = true; // Show loading spinner

    // Calculate the offset based on the current page
    const offset = this.currentPage * this.pokemonsPerPage;

    this.pokemonSubscription = this.pokemonService.getPokemons(this.pokemonsPerPage, offset).subscribe({
      next: (newPokemons: Pokemon[]) => {
        if (newPokemons.length > 0) {
          this.pokemons = [...this.pokemons, ...newPokemons]; // Append new Pokemons
          this.currentPage++; // Increment page for the next load
          console.log('Pokémons carregados:', this.pokemons);
        } else {
          this.allPokemonsLoaded = true; // No more Pokemons to load
          console.log('Todos os Pokémons foram carregados.');
        }
        this.isLoading = false; // Hide loading spinner
      },
      error: (error) => {
        console.error('Erro ao carregar Pokémons:', error);
        this.isLoading = false; // Hide loading spinner even on error
      }
    });
  }

  /**
   * Cleans up the subscription when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy() {
    if (this.pokemonSubscription) {
      this.pokemonSubscription.unsubscribe();
    }
  }

  addPokemonToFavorites(pokemon: Pokemon) {
    console.log('Adicionar aos favoritos:', pokemon.name);
    alert(`${pokemon.name} adicionado aos favoritos!`);
  }

  viewPokemonDetails(pokemonId: number) {
    this.router.navigate(['/tabs/details', pokemonId]);
  }
}