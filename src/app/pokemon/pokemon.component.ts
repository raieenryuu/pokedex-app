import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonDataService } from '../pokemon-data-service.service';
import { Pokemon } from '../types/pokemon-types';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
})
export class PokemonComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private pokemonDataService: PokemonDataService
  ) {}

  status = 'loading';
  pokemon: Pokemon | null = null;

  ngOnInit() {
    let id = this.route.snapshot.params['pokemonId'];

    this.pokemonDataService
      .getPokemonById(id)
      .then((pokemon) => {
        this.pokemon = pokemon;
        this.status = 'ready';
      })
      .catch((err) => (this.status = 'error'));
  }
}
