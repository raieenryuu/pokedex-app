import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'pokedex';

  private url = 'https://pokeapi.co/api/v2/pokemon';

  pokemonData: any;

  ngOnInit() {
    fetch(this.url)
      .then((res) => res.json())
      .then((pokemonData) => (this.pokemonData = pokemonData));
  }
}
