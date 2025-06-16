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
  IonProgressBar 
} from "@ionic/angular/standalone";

import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons'; 
import { Pokemon } from '../Type/pokemon';
// Interface para a estrutura do Pokémon

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
  ],
})
export class HomeComponent implements OnInit {

  // Array com dados mock de Pokémons
  pokemons: Pokemon[] = [
    {
      id: 1,
      name: 'Bulbasaur',
      type: 'Grama/Veneno',
      types: ['grass', 'poison'],
      description: 'Bulbasaur é um Pokémon de tipo Grama/Veneno. Ele tem uma semente nas costas que cresce e se desenvolve com ele.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      level: 82,
      height: 7, // 0.7m
      weight: 69, // 6.9kg
    },
    {
      id: 2,
      name: 'Charmander',
      type: 'Fogo',
      types: ['fire'],
      description: 'Charmander é um Pokémon tipo Fogo. A chama em sua cauda indica sua força vital.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
      level: 75,
      height: 6, // 0.6m
      weight: 85, // 8.5kg
    },
    {
      id: 3,
      name: 'Squirtle',
      type: 'Água',
      types: ['water'],
      description: 'Squirtle é um Pokémon tipo Água. Ele ataca jorrando água com força de sua boca.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
      level: 54,
      height: 5, // 0.5m
      weight: 90, // 9.0kg
    },
    {
      id: 4,
      name: 'Pikachu',
      type: 'Elétrico',
      types: ['electric'],
      description: 'Pikachu é um Pokémon elétrico popular. Ele armazena eletricidade em suas bochechas.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      level: 80,
      height: 4, 
      weight: 60, 
    },
    {
      id: 5,
      name: 'Jigglypuff',
      type: 'Normal/Fada',
      types: ['normal', 'fairy'],
      description: 'Jigglypuff canta uma melodia que faz seus oponentes dormirem. É conhecido por seu canto hipnotizante.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
      level: 54,
      height: 5, 
      weight: 55, 
    },
    {
      id: 6,
      name: 'Meowth',
      type: 'Normal',
      types: ['normal'],
      description: 'Meowth adora coisas que brilham, especialmente moedas. É um Pokémon astuto e inteligente.',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png',
      level: 40,
      height: 4, 
      weight: 42, 
    },
  ];

  constructor(private router: Router) {
    addIcons({ star }); 
  }

  ngOnInit() { }

  /**
 
   * @param pokemon O objeto Pokémon a ser adicionado.
   */
  addPokemonToFavorites(pokemon: Pokemon) {
    console.log('Adicionar ao favoritos:', pokemon.name);
    alert(`${pokemon.name} adicionado aos favoritos!`); 
  }

  /**
   * Navega para a tela de detalhes de um Pokémon específico.
   * @param pokemonId O ID do Pokémon para exibir os detalhes.
   */
  viewPokemonDetails(pokemonId: number) {
    this.router.navigate(['/tabs/details', pokemonId]);
  }
}
