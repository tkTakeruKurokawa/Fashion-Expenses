import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';
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

  cloth_data;
  titles: string[] = ["ブランドごとの消費額", "ブランドごとの所持数"];
  category: string = "brands";
  contents: string[] = ["value", "item_category"];

  constructor(private data_service: DataService) { }

  ngOnInit() {
    // this.get_data_list();
    this.cloth_data = this.data_service.get_cloth_data();
  }

  get_data_list() {
    this.data_service.get_cloth_data().subscribe(cloth_data => {
      this.cloth_data = cloth_data;
    });
  }
}
