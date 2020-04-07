import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Data } from "../data";
import { DATA } from "../mock-data";
import { Session } from "../Session";
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private db: AngularFirestore,
    private session: Session,
  ) { }

  get_cloth_data(): Observable<Data[]> {
    this.db.collection("users").doc(this.session.uid).collection("clothes").doc<Data>("lVzaafqGcVxgI1JQDw89").valueChanges().subscribe(data => console.log(data));
    return of(DATA);
  }

  search_data(term: string): Observable<Map<string, string>> {
    if (!term.trim()) {
      return of();
    }
    let result = new Map<string, string>();

    DATA.forEach(value => {
      Object.keys(value).forEach(key => {
        if (key === "brand" || key === "item") {
          let target: string = value[key];
          if (this.check_ja(term)) {
            if (this.to_kana(target).includes(this.to_kana(term))) {
              if (!result.has(target)) {
                result.set(target, key);
              }
            }
          } else {
            if (target.toUpperCase().includes(term.toUpperCase())) {
              if (!result.has(target)) {
                result.set(target, key);
              }
            }
          }
        }
      });
    });

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
