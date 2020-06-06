import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';

import { Data } from "../class-interface/data";
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { SessionService } from './session.service';
import { Session } from '../class-interface/Session';
import { Autocomplete } from "../class-interface/autocomplete";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  cloth_list: Data[] = [];
  cloth_data_subject = new BehaviorSubject<Data[]>(null);
  brand_options: Autocomplete[] = [];
  search_options: Autocomplete[] = [];
  filtered_brand_options: Observable<Autocomplete[]>;
  filtered_search_options: Observable<Autocomplete[]>;
  search_options_subject = new Subject<Autocomplete[]>();

  form_writable = false;
  edit_data: Data;

  uid: string = "";

  subscriptions: Subscription[] = [];

  constructor(
    private session_service: SessionService,
    private store: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  get_data_from_firestore() {
    this.subscriptions.push(
      this.session_service.session_state.subscribe((session: Session) => {
        if (session) {
          this.uid = session.uid;
          this.get_cloth_data_list(session.uid);
        }
      })
    );
  }

  get_cloth_data_list(uid: string) {
    if (uid) {
      this.subscriptions.push(
        this.store
          .collection("users")
          .doc(uid)
          .collection<Data>("clothes")
          .stateChanges()
          .pipe(
            // tap(() => console.count())
          )
          .subscribe(cloth_list => {
            this.build_cloth_list(cloth_list);
            this.cloth_data_subject.next(this.cloth_list);
            this.create_search_options_observable(this.cloth_list)
            this.search_options_subject.next(this.search_options);
          })
      );
    }
  }

  build_cloth_list(data_list: DocumentChangeAction<Data>[]) {
    data_list.forEach(data => {
      const cloth_data = data.payload.doc.data();
      const doc_key = data.payload.doc.id;

      switch (data.type) {
        case "added":
          this.add_cloth_data(cloth_data, doc_key);
          break;

        case "modified":
          this.modify_cloth_data(cloth_data, doc_key);
          break;

        case "removed":
          this.remove_cloth_data(doc_key);
          break;
      }
    });

    this.cloth_list.sort((a, b) => {
      if (a.brand < b.brand) return -1;
      if (a.brand > b.brand) return 1;
    });
  }

  add_cloth_data(cloth_data: Data, doc_key: string) {
    let url: string | Observable<string>;

    if (cloth_data["image"] === "../../assets/no_image.png") {
      url = cloth_data["image"];
    } else {
      const storage_rf = this.storage.ref(cloth_data["image"]);
      url = storage_rf.getDownloadURL();
    }

    this.cloth_list.push(this.create_cloth_data(cloth_data, url, doc_key));
  }

  modify_cloth_data(cur_data: Data, doc_key: string) {
    const index = this.cloth_list.findIndex(cloth => cloth.doc_key === doc_key);
    let pre_data = this.cloth_list[index];

    let url: string | Observable<string>;
    if (pre_data.image !== cur_data.image) {
      if (cur_data["image"] === "../../assets/no_image.png") {
        url = cur_data["image"];
      } else {
        const storage_rf = this.storage.ref(cur_data["image"]);
        url = storage_rf.getDownloadURL();
      }
    } else {
      url = cur_data["image"];
    }

    this.cloth_list[index] = this.create_cloth_data(cur_data, url, doc_key);
  }

  remove_cloth_data(doc_key: string) {
    this.cloth_list = this.cloth_list.filter(cloth => cloth.doc_key !== doc_key);
  }

  create_cloth_data(cloth_data: Data, url: string | Observable<string>, doc_key: string): Data {
    return {
      brand: cloth_data.brand,
      item_name: cloth_data.item_name,
      item_category: cloth_data.item_category,
      value: cloth_data.value,
      image: cloth_data.image,
      url: url,
      doc_key: doc_key
    }
  }

  create_search_options_observable(cloth_data_list: Data[]) {
    this.search_options = this.create_search_options(cloth_data_list);

    this.sort_autocomplete_options()
  }

  create_search_options(cloth_data_list: Data[]): Autocomplete[] {
    let autocomplete_list: Autocomplete[] = [];

    cloth_data_list.forEach(cloth_data => {
      const brands = cloth_data.brand.split(" x ");
      const length = brands.length;

      const chars = this.create_chars(brands);
      const categories = this.add_element(length, "brands", "items");
      const names = this.add_element(length, brands, cloth_data.item_category);

      autocomplete_list = this.push_autocomplete(autocomplete_list, chars, names, categories);
      if (length > 1) {
        autocomplete_list = this.push_autocomplete(autocomplete_list, [this.create_char(cloth_data.brand)], [cloth_data.brand], ["brands"]);
      }
    });

    return autocomplete_list;
  }

  create_chars(brands: string[]): string[] {
    let list = [];

    for (const brand of brands) {
      list.push(this.create_char(brand));
    }

    list.push("その他");
    return list;
  }

  create_char(brand: string): string {
    const char = brand[0];

    if (char.match(/^[0-9]*$/)) {
      return "0-9";
    } else if (this.check_ja(char)) {
      return "その他";
    }

    return char;
  }

  add_element(length: number, content: string | string[], last_content: string): string[] {
    let list = [];

    if (content instanceof Array) {
      list = content;
    } else {
      for (let index = 0; index < length; index++) {
        list.push(content);
      }
    }

    list.push(last_content);
    return list;
  }

  push_autocomplete(autocomplete_list: Autocomplete[], chars: string[], names: string[], categories: string[]): Autocomplete[] {
    chars.forEach((char, index) => {
      const autocomplete = this.get_autocomplete(autocomplete_list, char);

      if (autocomplete === void 0) {
        autocomplete_list.push(this.create_autocomplete_object(char, names[index], categories[index]));
      } else {
        if (!this.check_name_existing(autocomplete, names[index], categories[index])) {
          autocomplete.elements.push({ name: names[index], category: categories[index] });
        }
      }
    });

    return autocomplete_list;
  }

  get_autocomplete(autocomplete_list: Autocomplete[], char: string): Autocomplete {
    return autocomplete_list.find(autocomplete => autocomplete.char === char);
  }

  check_name_existing(autocomplete: Autocomplete, name: string, category: string): boolean {
    return (autocomplete.elements.find(auto => auto.name === name && auto.category === category) === void 0) ? false : true;
  }

  create_autocomplete_object(char: string, name: string, category: string): Autocomplete {
    return {
      char: char,
      elements: [{
        name: name,
        category: category,
      }]
    };
  }

  sort_autocomplete_options() {
    this.search_options.sort((a, b) => {
      if (a.char < b.char) return -1;
      if (a.char > b.char) return 1;
    });

    let autocomplete_list: Autocomplete[] = [];
    this.search_options.forEach(option => {
      option.elements.sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
      });

      option.elements
        .filter(element => element.category === "brands")
        .forEach(element => {
          autocomplete_list = this.push_autocomplete(autocomplete_list, [option.char], [element.name], [element.category]);
        })
    });
    this.brand_options = autocomplete_list;
  }

  get_search_options_subject(): Observable<Autocomplete[]> {
    return this.search_options_subject;
  }

  filter_options(type: string, term: string): Autocomplete[] {
    let options: Autocomplete[];
    if (type === "brand") {
      options = this.brand_options;
    }
    if (type === "search") {
      options = this.search_options;
    }

    if (term) {
      return options
        .map(autocomplete => {
          return {
            char: autocomplete.char,
            elements: this.filter_element_names(autocomplete.elements, term)
          }
        })
        .filter(autocomplete => autocomplete.elements.length > 0)
    }

    return options;
  }

  filter_element_names(element: { name: string, category: string }[], term: string): { name: string, category: string }[] {
    if (this.check_ja(term)) {
      return element.filter(object => this.to_kana(object.name).indexOf(this.to_kana(term)) > -1)
    } else {
      return element.filter(object => object.name.toUpperCase().indexOf(term.toUpperCase()) > -1)
    }
  }

  set_new_data_to_firestore(cloth_data: Data) {
    return this.store
      .collection("users")
      .doc(this.uid)
      .collection<Data>("clothes")
      .add(cloth_data);
  }

  set_edit_data_to_firestore(cloth_data: Data, doc_key: string) {
    return this.store
      .collection("users")
      .doc(this.uid)
      .collection<Data>("clothes")
      .doc(doc_key)
      .set(cloth_data);
  }


  get_cloth_data_subject(): Observable<Data[]> {
    return this.cloth_data_subject;
  }

  delete_data_from_firestore(doc_key: string, image_path: string) {
    this.store
      .collection("users")
      .doc(this.uid)
      .collection("clothes")
      .doc(doc_key)
      .delete();

    if (image_path !== "../../assets/no_image.png") {
      const storage_rf = this.storage.ref(image_path);
      storage_rf.delete();
    }
  }

  set_form_writable(flag: boolean) {
    this.form_writable = flag
  }

  get_form_writable(): boolean {
    return this.form_writable;
  }

  set_edit_data(data: Data) {
    this.edit_data = data;
  }

  get_edit_data(): Data {
    return this.edit_data
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

  reset_all_data() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    this.cloth_list = [];
    this.cloth_data_subject = new BehaviorSubject<Data[]>(null);
    this.brand_options = [];
    this.search_options = [];
    this.search_options_subject = new Subject<Autocomplete[]>();
    this.form_writable = false;
    this.uid = "";
    this.subscriptions = [];
  }
}
