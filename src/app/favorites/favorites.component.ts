import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MainHeaderComponent } from "../components/main-header/main-header.component";
import { FavoriteService } from '../Services/favorites/favorite.service';
import { Pokemon } from '../Types/pokemon';
import { Subscription } from 'rxjs';

import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  ToastController 
} from "@ionic/angular/standalone";

import { addIcons } from 'ionicons';
import { star, starOutline, home } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
   
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon
  ],
})
export class FavoritesComponent implements OnInit, OnDestroy {

  favoritePokemons: Pokemon[] = [];
  private favoritesSubscription: Subscription | undefined;

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
    private toastController: ToastController 
  ) {
    addIcons({ home, star, starOutline });
  }

  ngOnInit() {
    this.favoritesSubscription = this.favoriteService.favorites$.subscribe(
      (favorites: Pokemon[]) => {
        this.favoritePokemons = favorites;
        console.log('Pokémons favoritos carregados:', this.favoritePokemons);
      }
    );
  }

  ngOnDestroy() {
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  async removePokemonFromFavorites(pokemon: Pokemon) {
    this.favoriteService.removeFavorite(pokemon.id);
    await this.presentToast(`${pokemon.name} removido dos favoritos!`, 'danger');
  }

  viewPokemonDetails(pokemonId: number) {
    this.router.navigate(['/tabs/details', pokemonId]);
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
}