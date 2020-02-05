import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Data } from "./data";
import { DATA } from "./mock-data";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  get_data_list(): Observable<Data[]> {
    return of(DATA);
  }

  search_data(term: string): Observable<Data[]> {
    if (!term.trim()) {
      return of([]);
    }
    let result: any[] = [];

    DATA.forEach(value => {
      Object.keys(value).forEach(key => {
        if (key === "brand" || key === "item_category") {
          let target: string = value[key];
          if (this.check_ja(term)) {
            if (this.to_kana(target).includes(this.to_kana(term))) {
              if (!result.includes(target)) {
                result.push(target);
              }
            }
          } else {
            if (target.toUpperCase().includes(term.toUpperCase())) {
              if (!result.includes(target)) {
                result.push(target);
              }
            }
          }
        }
      });
    });

    result.sort();

    return of(result);
  }

  check_ja(str: string) {
    return (str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) ? true : false
  }

  to_kana(str: string) {
    return str.replace(/[\u3041-\u3096]/g, function (match) {
      var chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  }
}
