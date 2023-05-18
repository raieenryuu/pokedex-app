import { Component, OnInit } from '@angular/core';
import { PokemonDataService } from '../pokemon-data-service.service';
import { Pokemon } from '../types/pokemon-types';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  status = 'loading';

  offset = 0;

  constructor(private pokemonDataService: PokemonDataService) {}

  ngOnInit(): void {
    this.pokemonDataService
      .getPokemons(this.offset)
      .then((pokemons) => (this.pokemons = pokemons))
      .then(console.log);
  }

  loadMorePokemons() {
    this.pokemonDataService.getPokemons(this.offset + 9).then((pokemons) => {
      this.pokemons = [...this.pokemons, ...pokemons];

      this.offset += 9;
    });
  }
}
