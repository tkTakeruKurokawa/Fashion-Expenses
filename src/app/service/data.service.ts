import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject, pipe, } from 'rxjs';

import { Data } from "../class-interface/data";
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, take, switchMap, tap } from 'rxjs/operators';
import { SessionService } from './session.service';
import { Session } from '../class-interface/Session';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: Data[];
  cloth_subject = new BehaviorSubject<Data[]>(this.data);
  clothes: Observable<Data[]>;

  result_subject = new Subject<Map<string, string>>();
  result: Map<string, string>;
  search_property = ["brand", "item_category"];

  uid: string = "";

  constructor(
    private session_service: SessionService,
    private store: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }


  get_data_from_firestore() {
    if (this.uid.length < 1) {
      this.session_service.session_state.subscribe((session: Session) => {
        if (session.login) {
          this.uid = session.uid;
          this.get_data(session.uid);
        }
      });
    } else {
      this.get_data(this.uid);
    }
    // this.session_service.session_state.subscribe((session: Session) => {
    //   if (session.login) {
    //     this.session.uid = session.uid;
    //     this.clothes = this.store
    //       .collection("users")
    //       .doc(session.uid)
    //       .collection<Data>("clothes")
    //       .valueChanges()
    //       .pipe(
    //         map(actions => {
    //           return actions;
    //         })
    //       )
    //   }
    // });
  }

  get_data(uid: string) {
    this.clothes = this.store
      .collection("users")
      .doc(uid)
      .collection<Data>("clothes", ref => ref.orderBy("brand", "asc"))
      .snapshotChanges()
      .pipe(
        map(data_list => {
          return this.set_data(data_list);
        })
      )
    // .valueChanges()
    // .pipe(
    //   map(data_list => {
    //     return this.set_data(data_list);
    //   })
    // )
  }

  set_data(data_list: DocumentChangeAction<Data>[]): Data[] {
    let clothes: Data[] = [];

    data_list.map(data => {
      const cloth_data = data.payload.doc.data();
      const storage_rf = this.storage.ref(cloth_data["image"]);
      const download_url = storage_rf.getDownloadURL();

      clothes.push(
        {
          brand: cloth_data.brand,
          item_name: cloth_data.item_name,
          item_category: cloth_data.item_category,
          value: cloth_data.value,
          image: cloth_data.image,
          url: download_url,
          doc_key: data.payload.doc.id
        }
      );
    });

    return clothes;
  }

  // set_data(data_list: Data[]): Data[] {
  //   let clothes: Data[] = [];

  //   data_list.map(data => {
  //     const storage_rf = this.storage.ref(data["image"]);
  //     const download_url = storage_rf.getDownloadURL();
  //     clothes.push(
  //       {
  //         brand: data.brand,
  //         item_name: data.item_name,
  //         item_category: data.item_category,
  //         value: data.value,
  //         image: data.image,
  //         url: download_url
  //       }
  //     );
  //   });

  //   return clothes;
  // }

  set_data_to_firestore(cloth_data: Data) {
    this.store
      .collection("users")
      .doc(this.uid)
      .collection<Data>("clothes")
      .add(cloth_data);
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

  get_clothes_length(): Observable<number> {
    return this.clothes
      .pipe(
        map(data => {
          return data.length
        })
      );
  }

  delete_data_from_firestore(doc_key: string, image_path: string) {
    this.store
      .collection("users")
      .doc(this.uid)
      .collection("clothes")
      .doc(doc_key)
      .delete();

    if (!image_path.match("no_image.png")) {
      const storage_rf = this.storage.ref(image_path);
      storage_rf.delete();
    }
  }

  search_data(term: string): Observable<Map<string, string>> {
    if (!term.trim()) {
      return of();
    }
    this.result = new Map<string, string>();

    this.clothes.subscribe(data_list => {
      data_list.forEach(data => {
        this.search_property.forEach(property => {
          let target = data[property];
          if (this.check_ja(term)) {
            // if (this.to_kana(target).includes(this.to_kana(term))) {
            if (!this.to_kana(target).indexOf(this.to_kana(term))) {
              if (!this.result.has(target)) {
                this.result.set(target, property);
              }
            }
          } else {
            // if (target.toUpperCase().includes(term.toUpperCase())) {
            if (!target.toUpperCase().indexOf(term.toUpperCase())) {
              if (!this.result.has(target)) {
                this.result.set(target, property);
              }
            }
          }
        })
      });
      this.result_subject.next(this.result);
    })


    return this.result_subject.pipe(take(1));
  }

  check_ja(str: string): boolean {
    return (str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) ? true : false;
  }

  to_kana(str: string): string {
    return str.replace(/[\u3041-\u3096]/g, function (match) {
      var chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
    });
  }
}
