import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
  IonIcon,
} from "@ionic/angular/standalone";

import { addIcons } from 'ionicons';
import { star, starOutline, chevronForward, chevronBack, ellipsisHorizontal } from 'ionicons/icons'; // Adicione ellipsisHorizontal

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
    IonProgressBar,
    HttpClientModule,
    IonSpinner,
    IonIcon,
  ],
  providers: [PokemonService]
})
export class HomeComponent implements OnInit, OnDestroy {

  pokemons: Pokemon[] = [];
  isLoading: boolean = false;
  allPokemonsLoaded: boolean = false;

  // --- Propriedades para paginação de mobile ---
  mobileCurrentPage: number = 0;
  mobilePokemonsPerPage: number = 10; // 10 pokemons por "página" no mobile
  // ---------------------------------------------

  private pokemonSubscription: Subscription | undefined;
  private favoritesSubscription: Subscription | undefined;
  favoritePokemonIds: Set<number> = new Set();

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService,
    private toastController: ToastController,
  ) {
    // Adicione os ícones de navegação e o ícone de elipse
    addIcons({ star, starOutline, chevronForward, chevronBack, ellipsisHorizontal });
  }

  ngOnInit() {
    this.loadPokemons();
    this.subscribeToFavorites();
  }

  async addPokemonToFavorites(pokemon: Pokemon) {
    this.favoriteService.addFavorite(pokemon);
    await this.presentToast(`${pokemon.name} adicionado aos favoritos!`, 'success');
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

    // Calcula o offset com base no total de pokemons já carregados
    const offset = this.pokemons.length;
    const limit = 40; // Quantidade de pokemons a carregar por requisição API

    this.pokemonSubscription = this.pokemonService.getPokemons(limit, offset).subscribe({
      next: (newPokemons: Pokemon[]) => {
        if (newPokemons.length > 0) {
          // Filtra duplicatas antes de adicionar para evitar IDs repetidos
          const uniqueNewPokemons = newPokemons.filter(
            (newP) => !this.pokemons.some((existingP) => existingP.id === newP.id)
          );
          // Concatena e ordena por ID para manter a consistência
          this.pokemons = [...this.pokemons, ...uniqueNewPokemons].sort((a, b) => a.id - b.id);
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
        this.presentToast('Erro ao carregar Pokémons.', 'danger');
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
      color: color,
      // CSS para garantir que o toast apareça acima de outros elementos se necessário
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  viewPokemonDetails(pokemonId: number) {
    console.log('Clicked Details for Pokemon ID:', pokemonId);
    this.router.navigate(['/tabs/details', pokemonId]);
  }

  // --- Métodos e Propriedades de Paginação ---

  get paginatedPokemons(): Pokemon[] {
    const startIndex = this.mobileCurrentPage * this.mobilePokemonsPerPage;
    const endIndex = startIndex + this.mobilePokemonsPerPage;
    return this.pokemons.slice(startIndex, endIndex);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 0 && pageNumber < this.totalPages) {
      this.mobileCurrentPage = pageNumber;
    }
  }

  nextPage(): void {
    // Se não estiver na última página de exibição E a próxima página já tiver dados carregados
    if (this.mobileCurrentPage < this.totalPages - 1) {
      this.mobileCurrentPage++;
    } else if (!this.allPokemonsLoaded && !this.isLoading) {
      // Se estiver na última página de exibição e ainda houver pokemons para carregar
      // Carrega mais pokemons e, após o carregamento, a paginação avançará naturalmente
      this.loadPokemons();
     
      this.mobileCurrentPage++; // Tenta avançar visualmente, será corrigido se não houver dados.
    }
  }

  prevPage(): void {
    if (this.mobileCurrentPage > 0) {
      this.mobileCurrentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.pokemons.length / this.mobilePokemonsPerPage);
  }

  // Gera um array de números de página para exibição, incluindo elipses
  get pagesArray(): Array<number | null> {
    const maxPagesToShow = 5; // Número máximo de botões de página a serem exibidos diretamente
    const pages: Array<number | null> = [];
    const total = this.totalPages;
    const current = this.mobileCurrentPage;

    if (total <= maxPagesToShow) {
      // Se o total de páginas for menor ou igual ao máximo a mostrar, exibe todas
      for (let i = 0; i < total; i++) {
        pages.push(i);
      }
    } else {
      // Sempre adiciona a primeira página
      pages.push(0);

      // Calcula o início e o fim da janela de páginas ao redor da página atual
      let start = Math.max(1, current - Math.floor((maxPagesToShow - 3) / 2));
      let end = Math.min(total - 2, current + Math.ceil((maxPagesToShow - 3) / 2));

      // Ajusta o início e o fim para garantir que 'maxPagesToShow' páginas sejam mostradas
      if (current < Math.floor(maxPagesToShow / 2)) {
        end = maxPagesToShow - 2;
      } else if (current > total - Math.ceil(maxPagesToShow / 2)) {
        start = total - (maxPagesToShow - 1);
      }

      // Adiciona elipses se houver páginas omitidas após a primeira página
      if (start > 1) {
        pages.push(null); // Representa as elipses
      }

      // Adiciona as páginas dentro da janela
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Adiciona elipses se houver páginas omitidas antes da última página
      if (end < total - 2) {
        pages.push(null); // Representa as elipses
      }

      // Sempre adiciona a última página (se não for a mesma que a primeira)
      if (total > 1 && !pages.includes(total - 1)) {
         pages.push(total - 1);
      }
    }
    return pages;
  }

  get showPaginationControls(): boolean {
    return this.totalPages > 1;
  }
}