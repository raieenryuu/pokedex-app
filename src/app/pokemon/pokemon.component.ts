import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonDataService } from '../pokemon-data-service.service';
import { Pokemon } from '../types/pokemon-types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
})
export class PokemonComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private pokemonDataService: PokemonDataService
  ) {}

  status = 'loading';
  pokemon: Pokemon | null = null;

  subscriptions: Subscription[] = [];

  ngOnInit() {
    let id = this.route.snapshot.params['pokemonId'];

    const getPokemonSubs = this.pokemonDataService
      .getPokemonById(id)
      .subscribe({
        next: (pokemon) => {
          this.pokemon = pokemon;
          this.status = 'ready';
        },
        error: () => {
          this.status = 'error';
        },
      });

    this.subscriptions.push(getPokemonSubs);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }
}
