import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonDataService } from '../pokemon-data-service.service';
import { ApiResponse, Pokemon } from '../types/pokemon-types';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit, OnDestroy {
  cachedUrls: ApiResponse | null = null;
  viewPokemon: Pokemon[] = [];
  initialPokemon: Pokemon[] = [];
  status = 'loading';
  buttonStatus = 'ready';
  offset = 0;
  view = '';

  searchText: string = '';

  twoWayInput = '';

  subscriptions: Subscription[] = [];

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit(): void {
    const subscriptionUrls = this.pokemonDataService
      .getAllPokemonUrls()
      .subscribe({
        next: (returnApi) => {
          this.cachedUrls = returnApi;

          const initialPokemonSubscription = this.pokemonDataService
            .getPokemons(this.offset, returnApi)
            ?.subscribe({
              next: (value) => {
                this.initialPokemon = value;
                this.viewPokemon = value;
                this.status = 'ready';
              },
              error: () => {
                this.status = 'error';
              },
            });

          this.subscriptions.push(initialPokemonSubscription);
        },
        error: () => {
          this.status = 'error';
        },
      });

    this.subscriptions.push(subscriptionUrls);

    let initialPokemonSubscription = this.pokemonDataService
      .getPokemons(this.offset, this.cachedUrls)
      ?.subscribe({
        next: (value) => {
          this.initialPokemon = value;
          this.viewPokemon = value;
          this.status = 'ready';
        },
        error: () => {
          this.status = 'error';
        },
      });

    this.subscriptions.push(initialPokemonSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  loadMorePokemons() {
    this.buttonStatus = 'loading';
    const loadSubscription = this.pokemonDataService
      .getPokemons(this.offset + 9, this.cachedUrls)
      .pipe()
      ?.subscribe({
        next: (value) => {
          this.viewPokemon = [...this.viewPokemon, ...value];
          this.status = 'ready';
          this.buttonStatus = 'ready';
        },
        error: () => {
          this.status = 'error';
        },
      });

    this.subscriptions.push(loadSubscription);
  }

  searchPokemon(name: string) {
    if (name.length < 3) {
      return;
    }

    this.status = 'loading';
    this.view = 'search';
    let pokemons = this.cachedUrls?.results.filter((pokemon) =>
      pokemon.name.includes(name.toLowerCase())
    );

    console.log(pokemons);

    if (pokemons?.length == 0) {
      this.viewPokemon = [];
      this.status = 'ready';
      return;
    }

    const searchSubscription = this.pokemonDataService
      .getPokemonsByUrls(pokemons)
      .subscribe({
        next: (pokemons) => {
          this.viewPokemon = pokemons;
          this.status = 'ready';
          this.buttonStatus = 'ready';
        },
        error: () => {
          this.status = 'error';
        },
      });

    this.subscriptions.push(searchSubscription);
  }

  cleanSearch() {
    this.viewPokemon = this.initialPokemon;
    this.view = '';
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.searchPokemon(this.searchText);
  }

  handleKeyUp() {
    this.searchPokemon(this.searchText);
  }
}
