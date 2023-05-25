import { Injectable } from '@angular/core';
import { ApiResponse, Pokemon, Result } from './types/pokemon-types';
import { environment } from 'src/environments/environment';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';

import { Observable, forkJoin, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonDataService {
  constructor(private http: HttpClient) {}
  private url = environment.pokemonUrl;

  getPokemons(offset: number, pokemonUrls: ApiResponse | null) {
    let pokemonObservables: Observable<Pokemon>[] = [];

    if (!pokemonUrls) {
      return forkJoin(pokemonObservables);
    }
    for (let i = offset; i < offset + 9; i++) {
      pokemonObservables.push(
        this.http.get<Pokemon>(pokemonUrls.results[i].url)
      );
    }

    return forkJoin(pokemonObservables);
  }

  getAllPokemonUrls() {
    return this.http.get<ApiResponse>(`${this.url}?offset=0&limit=${1281}`);
  }

  getPokemonsByUrls(urls: Result[] | undefined) {
    let pokemons: Observable<Pokemon>[] = [];

    if (!urls?.length) {
      return of([]);
    }
    for (let url of urls) {
      pokemons.push(this.http.get<Pokemon>(url.url));
    }
    return forkJoin(pokemons);
  }

  getPokemonById(id: number) {
    return this.http.get<Pokemon>(`${this.url}/${id}`);
  }
}
