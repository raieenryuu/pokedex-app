import { TestBed } from '@angular/core/testing';

import { PokemonDataService } from './pokemon-data-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
describe('PokemonDataServiceService', () => {
  let service: PokemonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(PokemonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
