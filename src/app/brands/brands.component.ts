import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../class-interface/data';
import { DataService } from '../service/data.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  @Input() display_number: number = 5;
  @Input() show_others: boolean = true;

  titles: string[] = ["ブランドごとの消費額", "ブランドごとの所持数"];
  category: string = "brands";
  contents: string[] = ["value", "item_category"];

  number_of_data: number = 0;

  constructor(private data_service: DataService) { }

  ngOnInit() {
    this.data_service.get_clothes_length()
      .subscribe(length => this.number_of_data = length);
  }
}
