import { Injectable } from '@angular/core';
import { ApiResponse, Pokemon, Result } from './types/pokemon-types';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class PokemonDataService {
  private url = environment.pokemonUrl;

  async getPokemons(offset: number, pokemonUrls: ApiResponse | null) {
    if (pokemonUrls) {
      let pokemons: Pokemon[] = [];

      for (let i = offset; i < offset + 9; i++) {
        await axios
          .get<Pokemon>(pokemonUrls.results[i].url)
          .then((res) => pokemons.push(res.data));
      }

      return pokemons;
    }

    return [];
  }

  async getAllPokemonUrls() {
    let urls = await axios.get<ApiResponse>(
      `${this.url}?offset=0&limit=${1281}`
    );

    return urls.data;
  }

  async getPokemonsByUrls(urls: Result[] | undefined) {
    let pokemons: Pokemon[] = [];

    if (!urls) {
      return pokemons;
    }
    for (let url of urls) {
      await axios.get<Pokemon>(url.url).then((res) => pokemons.push(res.data));
    }
    return pokemons;
  }

  async getPokemonById(id: number) {
    let pokemon = await axios.get<Pokemon>(`${this.url}/${id}`);

    return pokemon.data;
  }
}
