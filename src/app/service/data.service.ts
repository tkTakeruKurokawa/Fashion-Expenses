import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject, } from 'rxjs';

import { Data } from "../data";
import { DATA } from "../mock-data";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { SessionService } from './session.service';
import { Session } from '../Session';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: Data[];
  cloth_subject = new BehaviorSubject<Data[]>(this.data);
  // cloth_subject;
  // clothes = this.cloth_subject.asObservable();
  clothes: Observable<Data[]>;

  constructor(
    private session_service: SessionService,
    private store: AngularFirestore,
  ) { }


  get_data_from_firestore() {
    this.session_service.session_state.subscribe((session: Session) => {
      if (session.login) {
        this.clothes = this.store
          .collection("users")
          .doc(session.uid)
          .collection<Data>("clothes")
          .valueChanges()
          .pipe(
            map(actions => {
              return actions;
            })
          )
        // .snapshotChanges()
        // .pipe(
        //   map(actions => actions.map(action => {
        //     const data = action.payload.doc.data() as Data;
        //     return data;
        //   }))
        // )

        // .subscribe((data: Data[]) => {
        //   console.log("get data from firestore");
        //   this.data = data;
        //   this.cloth_subject = new BehaviorSubject<Data[]>(data);
        //   this.cloth_subject.next(data);
        //   this.clothes = this.cloth_subject.asObservable()
        // });
      }
    });
  }

  get_cloth_data(): Observable<Data[]> {
    // console.log(this.clothes);
    // this.cloth_subject.next(this.data);
    return this.clothes;
    // return new Observable((observer => {
    //   observer.next(this.data);
    // }));
    // return of(this.data);
    // return of(DATA);
  }

  // get_brand_data(): Observable<{name: string[]; value: number[]}> {
  // return this.clothes.pipe(
  //   map(data => {
  //     data[brand]
  //   })
  // );
  // }

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
