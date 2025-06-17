import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para obter o ID da URL
import { CommonModule } from '@angular/common'; // Para usar *ngIf, etc.
import { Subscription } from 'rxjs'; // Para gerenciar a inscrição do Observable

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonText,
  IonProgressBar,
  IonSpinner, // Para exibir um spinner durante o carregamento
  IonCard,
  IonCardContent,
  IonLabel,
  IonItem,
  IonList, IonTabButton } from '@ionic/angular/standalone';

import { MainHeaderComponent } from "../components/main-header/main-header.component";
import { PokemonService } from '../Services/pokemon/pokemon.component'; // Importe o serviço
import { Pokemon } from '../Types/pokemon'; // Importe a interface do Pokémon
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss'],
  standalone: true,
  imports: [IonTabButton, 
    CommonModule,
    MainHeaderComponent, 
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonProgressBar,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonLabel,
    IonItem,
    IonList,
    HttpClientModule
  ],
  providers: [PokemonService] 
})
export class MainDetailsComponent implements OnInit, OnDestroy {
  pokemon: Pokemon | undefined;
  isLoading: boolean = true;
  private routeSubscription: Subscription | undefined;
  private pokemonDetailsSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService
  ) { }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const pokemonId = params.get('id');
      if (pokemonId) {
        this.getPokemonDetails(pokemonId);
      } else {
        console.error('ID do Pokémon não encontrado na rota.');
        this.isLoading = false;
      }
    });
  }

  getPokemonDetails(id: string) {
    this.isLoading = true;
    this.pokemonDetailsSubscription = this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do Pokémon:', err);
        this.isLoading = false;
        // Opcional: exibir uma mensagem de erro para o usuário
      }
    });
  }

  ngOnDestroy() {
    // Garanta que todas as inscrições sejam canceladas para evitar vazamentos de memória
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.pokemonDetailsSubscription) {
      this.pokemonDetailsSubscription.unsubscribe();
    }
  }
}