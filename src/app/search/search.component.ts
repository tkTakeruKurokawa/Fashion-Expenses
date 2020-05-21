import { Component, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable, Subject, pipe, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, startWith, map } from "rxjs/operators";
import { Data } from "../class-interface/data";
import { DataService } from "../service/data.service";
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Autocomplete } from '../class-interface/autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  search = new FormControl('');
  search_options: Observable<Autocomplete[]>;
  subscription: Subscription;

  constructor(
    private data_service: DataService
  ) { }

  ngOnInit() {
    this.subscription = this.data_service.get_search_options_subject()
      .subscribe(() => {
        this.search_options = this.search
          .valueChanges
          .pipe(
            startWith(''),
            // debounceTime(500),
            // distinctUntilChanged(),
            map(term => this.data_service.filter_options("search", term)),
          );
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

