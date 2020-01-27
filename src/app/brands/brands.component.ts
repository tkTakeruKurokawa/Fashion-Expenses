import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
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
