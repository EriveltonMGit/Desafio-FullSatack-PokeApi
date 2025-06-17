import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';

import {
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonLabel,
  IonTabButton,
  IonList,
  IonItem,
  IonAvatar,
  IonText,
  IonSpinner,
  IonContent,
  IonTitle
} from '@ionic/angular/standalone';

import { PokemonService } from '../../Services/pokemon/pokemon.component';
import { Pokemon } from '../../Types/pokemon';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabButton,
    IonLabel,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonAvatar,
    IonText,
    IonSpinner,
    HttpClientModule
],
  providers: [PokemonService]
})
export class MainHeaderComponent implements OnInit, OnDestroy {

  searchResults: Pokemon[] = [];
  searchLoading: boolean = false;
  public searchTerms = new Subject<string>();
  public currentSearchValue: string = '';

  private searchSubscription: Subscription | undefined;

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.searchSubscription = this.searchTerms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.currentSearchValue = term;

        if (!term.trim()) {
          this.searchResults = [];
          this.searchLoading = false;
          return of([]);
        }
        this.searchLoading = true;

        return this.pokemonService.getPokemonDetails(term.toLowerCase()).pipe(
          map(pokemon => {
            this.searchLoading = false;
            return [pokemon];
          }),
          catchError(error => {
            console.error('Error in search:', error);
            this.searchLoading = false;
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  onSearchChange(event: any) {
    this.searchTerms.next(event.detail.value);
  }

  clearSearch() {
    this.searchResults = [];
    this.searchLoading = false;
    this.searchTerms.next('');
    this.currentSearchValue = '';
  }
}