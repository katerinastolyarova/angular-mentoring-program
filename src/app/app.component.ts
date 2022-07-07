import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  combineLatest,
  filter,
  forkJoin,
  fromEvent,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
  distinctUntilChanged,
  debounceTime,
  zip,
  scan,
  mergeMap,
} from 'rxjs';
import { toArray } from 'rxjs/operators';
import { MockDataService } from './mock-data.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  searchTermByCharacters = new Subject<string>();
  charactersResults$: Observable<any>;
  planetAndCharactersResults$: Observable<any>;
  isLoading: boolean = false;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.initLoadingState();
    this.initCharacterEvents();
  }

  changeCharactersInput(element): void {
    // 1.1. Add functionality to changeCharactersInput method. Changes searchTermByCharacters Subject value on input change.
    const inputValue: string = element.target.value;
    this.searchTermByCharacters.next(inputValue);
  }

  initCharacterEvents(): void {
    // 1.2. Add API call on each user input. Use mockDataService.getCharacters - to make get request.

    // 2. Since we don't want to spam our service add filter by input value and do not call API until a user enters at least 3 chars.

    // 3. Add debounce to prevent API calls until user stop typing.

    this.charactersResults$ = this.searchTermByCharacters.pipe(
      filter((data) => data.length >= 3),
      distinctUntilChanged(),
      debounceTime(300),
      switchMap((searchTerm) => this.mockDataService.getCharacters(searchTerm))
    );
  }

  loadCharactersAndPlanet(): void {
    // 4. On clicking the button 'Load Characters And Planets', it is necessary to process two requests and combine the results of both requests into one result array. As a result, a list with the names of the characters and the names of the planets is displayed on the screen.
    // Your code should looks like this: this.planetAndCharactersResults$ = /* Your code */

    this.planetAndCharactersResults$ = forkJoin([
      this.mockDataService.getCharacters(),
      this.mockDataService.getPlatents(),
    ])
      .pipe(
        mergeMap((items) => items),
        mergeMap((items) => items)
      )
      .pipe(toArray());
  }

  initLoadingState(): void {
    /* 5.1. Let's add loader logic to our page. For each request, we have an observable that contains the state of the request. When we send a request the value is true, when the request is completed, the value becomes false. You can get value data with mockDataService.getCharactersLoader() and mockDataService.getPlanetLoader().
    
    - Combine the value of each of the streams.
    - Subscribe to changes
    - Check the received value using the areAllValuesTrue function and pass them to the isLoading variable. */
    zip(
      this.mockDataService.getPlanetLoader(),
      this.mockDataService.getCharactersLoader()
    )
      .pipe(map((value) => this.areAllValuesTrue(value)))
      .subscribe((data) => {
        this.isLoading = data;
      });
  }

  ngOnDestroy(): void {
    // 5.2 Unsubscribe from all subscriptions
    this.searchTermByCharacters.unsubscribe();
  }

  areAllValuesTrue(elements: boolean[]): boolean {
    return elements.every((el) => el);
  }
}
