import { Component, ElementRef, OnInit, HostListener } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Data } from "../class-interface/data";
import { DataService } from "../service/data.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  show: boolean = false;
  data_list$: Observable<Map<string, string>>;
  private search_terms = new Subject<string>();

  @HostListener('document:click', ['$event'])
  on_click(event) {
    this.show = false;
    if (this.element_ref.nativeElement.contains(event.target)) {
      this.show = true;
    }
  };

  constructor(
    private element_ref: ElementRef,
    private data_service: DataService
  ) { }

  ngOnInit() {

    this.data_list$ = this.search_terms.pipe(
      // 各キーストロークの後、検索前に300ms待つ
      debounceTime(500),

      // 直前の検索語と同じ場合は無視する
      distinctUntilChanged(),

      // 検索語が変わる度に、新しい検索observableにスイッチする
      switchMap((term: string) => this.data_service.search_data(term)),
    );
  }

  search(term: string): void {
    this.search_terms.next(term);
  }
}

