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
export class HomeComponent implements OnInit, OnDestroy { // Add OnDestroy for proper cleanup

  pokemons: Pokemon[] = [];
  currentPage: number = 0; // Tracks the current page/offset
  pokemonsPerPage: number = 20; // Number of Pokemons to load per request
  isLoading: boolean = false; // To show/hide loading spinner
  allPokemonsLoaded: boolean = false; // To disable "Load More" button when no more data

  private pokemonSubscription: Subscription | undefined; // To manage observable subscription

  constructor(
    private router: Router,
    private pokemonService: PokemonService
  ) {
    addIcons({ star }); // Initialize Ionicons
  }

  ngOnInit() {
    this.loadPokemons(); // Load initial set of Pokemons when component initializes
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
          this.pokemons = [...this.pokemons, ...newPokemons]; // Append new Pokemons to the existing list
          this.currentPage++; // Increment page for the next load
          console.log('Pokemons loaded:', this.pokemons);
        } else {
          this.allPokemonsLoaded = true; // No more Pokemons to load, mark as all loaded
          console.log('All Pokemons have been loaded.');
        }
        this.isLoading = false; // Hide loading spinner
      },
      error: (error) => {
        console.error('Error loading Pokemons:', error);
        this.isLoading = false; // Hide loading spinner even on error
      }
    });
  }

  /**
   * Cleans up the subscription when the component is destroyed to prevent memory leaks.
   */
  ngOnDestroy() {
    if (this.pokemonSubscription) {
      this.pokemonSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }

  /**
   * Handles adding a Pokemon to favorites (console log and alert for now).
   * @param pokemon The Pokemon object to add.
   */
  addPokemonToFavorites(pokemon: Pokemon) {
    console.log('Adding to favorites:', pokemon.name);
    alert(`${pokemon.name} added to favorites!`); // Simple alert for user feedback
  }

  /**
   * Navigates to the Pokemon details page using its ID.
   * @param pokemonId The ID of the Pokemon to view details for.
   */
  viewPokemonDetails(pokemonId: number) {
    console.log('Clicked Details for Pokemon ID:', pokemonId); // Debugging log
    this.router.navigate(['/tabs/details', pokemonId]); // Navigate to the details route
  }
}