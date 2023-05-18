import { Injectable } from '@angular/core';
import { ApiResponse, Pokemon } from './types/pokemon-types';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PokemonDataService {
  private url = 'https://pokeapi.co/api/v2/pokemon';

  private limit = 9;

  async getPokemons(offset: number) {
    let pokemons: Pokemon[] = [];
    const response = await axios.get<ApiResponse>(
      `${this.url}?offset=${offset}&limit=${this.limit}`
    );

    for (let pokemonUrl of response.data.results) {
      await axios
        .get<Pokemon>(pokemonUrl.url)
        .then((res) => pokemons.push(res.data));
    }

    return pokemons;
  }
}
