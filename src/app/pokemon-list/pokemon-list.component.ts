import { Component, OnInit } from '@angular/core';
import { PokemonDataService } from '../pokemon-data-service.service';
import { ApiResponse, Pokemon } from '../types/pokemon-types';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  cachedUrls: ApiResponse | null = null;
  viewPokemon: Pokemon[] = [];
  initialPokemon: Pokemon[] = [];
  status = 'loading';
  buttonStatus = 'ready';
  offset = 0;
  view = '';

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit(): void {
    this.pokemonDataService
      .getAllPokemonUrls()
      .then((urls) => {
        this.cachedUrls = urls;

        return this.pokemonDataService.getPokemons(
          this.offset,
          this.cachedUrls
        );
      })
      .then((pokemons) => {
        this.viewPokemon = pokemons;
        this.initialPokemon = pokemons;

        this.status = 'ready';
      })
      .catch((err) => (this.status = 'error'));
  }

  loadMorePokemons() {
    this.buttonStatus = 'loading';
    this.pokemonDataService
      .getPokemons(this.offset + 9, this.cachedUrls)
      .then((pokemons) => {
        this.viewPokemon = [...this.viewPokemon, ...pokemons];

        this.offset += 9;

        this.buttonStatus = 'ready';
      })
      .catch((error) => (this.status = 'error'));
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
    this.pokemonDataService
      .getPokemonsByUrls(pokemons)
      .then((pokemons) => {
        this.viewPokemon = pokemons;
        this.status = 'ready';
      })
      .catch((error) => {
        this.status = 'error';
      });
  }

  cleanSearch() {
    this.viewPokemon = this.initialPokemon;
    this.view = '';
  }
}
