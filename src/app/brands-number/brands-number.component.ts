import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';

@Component({
  selector: 'app-brands-number',
  templateUrl: './brands-number.component.html',
  styleUrls: ['./brands-number.component.scss']
})
export class BrandsNumberComponent implements OnInit {
  @Input() data_list: Data[];
  @Input() display_number: number;
  @Input() show_others: boolean;

  brand_name: string[] = [];
  brand_number: number[] = [];
  total_number: number = 0;

  bar_brand_name: string[] = [];
  bar_brand_number: number[] = [];
  bar_data: any[] = [
    { data: this.bar_brand_number },
  ];
  options: any = {
    responsive: true,
    mainAspectRate: false,
    legend: {
      position: "bottom",
    },
  };
  legend: boolean = true;
  type: string = "pie";

  panel_state: boolean = false;


  constructor() { }

  ngOnInit() {
    this.make_ranking();
    this.sort_ranking();
    this.display_filter();
  }

  make_ranking() {
    this.data_list.forEach(data => {
      if (this.brand_name.includes(data.brand)) {
        let index = this.brand_name.findIndex(name => name === data.brand);
        this.brand_number[index]++;
      } else {
        this.brand_name.push(data.brand);
        this.brand_number.push(1);
      }
      this.total_number++;
    });
  }

  swap(top: number, moved_top: number) {
    let tmp_number = this.brand_number[top];
    let tmp_name = this.brand_name[top];
    this.brand_number[top] = this.brand_number[moved_top];
    this.brand_name[top] = this.brand_name[moved_top];
    this.brand_number[moved_top] = tmp_number;
    this.brand_name[moved_top] = tmp_name;
  }

  quick_sort(top: number, bottom: number) {
    let moved_top: number;
    let moved_bottom: number;

    if (top >= bottom) {
      return;
    }

    moved_top = top;

    for (moved_bottom = top + 1; moved_bottom <= bottom; moved_bottom++) {
      if (this.brand_number[moved_bottom] > this.brand_number[top]) {
        this.swap(++moved_top, moved_bottom);
      }
    }
    this.swap(top, moved_top);

    this.quick_sort(top, moved_top - 1);
    this.quick_sort(moved_top + 1, bottom)
  }

  sort_ranking() {
    this.quick_sort(0, this.brand_number.length - 1);
  }

  display_filter() {
    this.brand_name.forEach((name, index) => {
      if (index >= 10) {
        if (this.bar_brand_name.includes("その他")) {
          this.bar_brand_number[10] = this.bar_brand_number[10] + this.brand_number[index];
        } else {
          this.bar_brand_name[10] = "その他";
          this.bar_brand_number[10] = this.brand_number[10];
        }
      } else {
        this.bar_brand_name.push(name);
        this.bar_brand_number.push(this.brand_number[index]);
      }
    });
  }
}
