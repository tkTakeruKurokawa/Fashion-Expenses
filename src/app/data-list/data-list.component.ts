import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../class-interface/data';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {
  cloth_data: Data[];

  number_of_data: number = 0;

  constructor(
    private data_service: DataService
  ) { }

  ngOnInit() {
    this.get_cloth_list();
  }

  get_cloth_list() {
    this.data_service.get_cloth_data()
      .subscribe(cloth_list => {
        this.cloth_data = cloth_list
        this.number_of_data = this.cloth_data.length;
      });
  }

  edit_this_data(cloth_data: Data) {
    console.log(cloth_data);
  }

  delete_this_data(doc_key: string, image_path: string) {
    this.data_service.delete_data_from_firestore(doc_key, image_path);
  }
}
