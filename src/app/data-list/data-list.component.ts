import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Data } from '../class-interface/data';
import { DataService } from '../service/data.service';
import { Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit, OnDestroy {
  data: Data;
  cloth_data: Data[];
  subscription: Subscription;

  number_of_data: number;
  writable: boolean = false;

  constructor(
    private data_service: DataService
  ) { }

  ngOnInit() {
    this.get_cloth_list();
  }

  get_cloth_list() {
    this.subscription = this.data_service.get_cloth_data_subject()
      .subscribe(cloth_list => {
        if (cloth_list) {

          this.cloth_data = cloth_list
          this.number_of_data = this.cloth_data.length;
        }
      });
  }

  is_observable(url: string | Observable<string>): boolean {
    return (typeof url === "string" ? false : true);
  }

  edit_this_data(cloth_data: Data) {
    this.data_service.set_edit_data(cloth_data);
  }

  delete_this_data(doc_key: string, image_path: string) {
    this.data_service.delete_data_from_firestore(doc_key, image_path);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
