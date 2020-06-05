import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { startWith, map } from "rxjs/operators";
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

  @ViewChild('input', { static: false }) input: ElementRef;

  constructor(
    private data_service: DataService,
  ) { }

  ngOnInit() {
    this.subscription = this.data_service.get_search_options_subject()
      .subscribe(() => {
        this.search_options = this.search
          .valueChanges
          .pipe(
            startWith(''),
            map(term => this.data_service.filter_options("search", term)),
          );
      });
  }

  reset_term() {
    this.search.reset();
    setTimeout(() => this.input.nativeElement.blur());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

