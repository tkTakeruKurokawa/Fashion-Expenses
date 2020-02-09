import { Component, OnInit } from '@angular/core';
import { Data } from '../data';
import { DataService } from '../data.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {
  cloth_data: Data[];

  constructor(private data_service: DataService) { }

  ngOnInit() {
    this.get_cloth_list();
  }

  get_cloth_list() {
    this.data_service.get_cloth_data().subscribe(cloth_list => {
      this.cloth_data = cloth_list
    });
  }

}
