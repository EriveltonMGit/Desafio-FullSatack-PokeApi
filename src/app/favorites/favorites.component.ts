// src/app/favorites/favorites.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para ngFor, ngIf
import { RouterModule, Router } from '@angular/router'; // Para navegação
import { MainHeaderComponent } from "../components/main-header/main-header.component";
import { FavoriteService } from '../Services/favorites/favorite.service'; // Importa o serviço de favoritos
import { Pokemon } from '../Types/pokemon'; // Importa o tipo Pokemon
import { Subscription } from 'rxjs'; // Para gerenciar a subscrição

import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonButton,
  IonProgressBar,
  IonIcon, // Adicione IonIcon para o botão de favoritos
  ToastController // Para feedback do usuário
} from "@ionic/angular/standalone";

import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons'; // Adicione starOutline

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // Adicione CommonModule
    RouterModule, // Adicione RouterModule
    MainHeaderComponent,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonButton,
   
    IonIcon // Adicione IonIcon
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
    addIcons({ star, starOutline }); // Inicializa os ícones de estrela
  }

  ngOnInit() {
    // Subscreve-se às mudanças na lista de favoritos
    this.favoritesSubscription = this.favoriteService.favorites$.subscribe(
      (favorites: Pokemon[]) => {
        this.favoritePokemons = favorites;
        console.log('Pokémons favoritos carregados:', this.favoritePokemons);
      }
    );
  }

  ngOnDestroy() {
    // Cancela a subscrição para evitar vazamento de memória
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
  }

  /**
   * Remove um Pokémon dos favoritos e exibe um Toast.
   * @param pokemon O Pokémon a ser removido.
   */
  async removePokemonFromFavorites(pokemon: Pokemon) {
    this.favoriteService.removeFavorite(pokemon.id);
    await this.presentToast(`${pokemon.name} removido dos favoritos!`, 'danger');
  }

  /**
   * Navega para a página de detalhes de um Pokémon.
   * @param pokemonId O ID do Pokémon.
   */
  viewPokemonDetails(pokemonId: number) {
    this.router.navigate(['/tabs/details', pokemonId]);
  }

  /**
   * Exibe um Toast na tela.
   * @param message A mensagem do Toast.
   * @param color A cor do Toast (e.g., 'success', 'danger', 'primary').
   */
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