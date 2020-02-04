import { Component, OnInit } from '@angular/core';
import { Data } from '../data';
import { DataService } from '../data.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {
  data_list: Data[];

  constructor(private data_service: DataService) { }

  ngOnInit() {
    this.get_data_list();
  }

  get_data_list() {
    this.data_service.get_data_list().subscribe(data_list => {
      this.data_list = data_list
      console.log(data_list);
    });
  }

}
