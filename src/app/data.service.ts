import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Data } from "./data";
import { DATA } from "./mock-data";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  get_data(): Observable<Data[]> {
    return of(DATA);
  }
}
