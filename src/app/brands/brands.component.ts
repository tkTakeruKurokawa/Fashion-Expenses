import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';
import { DataService } from '../data.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  @Input() display_number: number = 5;
  @Input() show_others: boolean = true;
  data_list: Data[];

  constructor(private data_service: DataService) { }

  ngOnInit() {
    this.get_data_list();
  }

  get_data_list() {
    this.data_service.get_data_list().subscribe(data_list => {
      this.data_list = data_list;
    });
  }
}
