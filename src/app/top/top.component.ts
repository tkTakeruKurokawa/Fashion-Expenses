import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  number_of_data: number;

  constructor(private data_service: DataService) { }

  ngOnInit() {
    this.data_service.get_clothes_length()
      .subscribe(length => this.number_of_data = length);
  }

}
