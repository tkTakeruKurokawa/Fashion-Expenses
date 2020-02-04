import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';

@Component({
  selector: 'app-brands-value',
  templateUrl: './brands-value.component.html',
  styleUrls: ['./brands-value.component.scss']
})
export class BrandsValueComponent implements OnInit {
  @Input() data_list: Data[];
  @Input() display_number: number;
  @Input() show_others: boolean;

  brand_name: string[] = [];
  brand_value: number[] = [];
  total_value: number = 0;

  bar_brand_name: string[] = [];
  bar_brand_value: number[] = [];
  bar_data: any[] = [
    { data: this.bar_brand_value, label: "消費額" },
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
        this.brand_value[index] = this.brand_value[index] + data.value;
      } else {
        this.brand_name.push(data.brand);
        this.brand_value.push(data.value);
      }
      this.total_value += data.value;
    });
  }

  swap(top: number, moved_top: number) {
    let tmp_value = this.brand_value[top];
    let tmp_name = this.brand_name[top];
    this.brand_value[top] = this.brand_value[moved_top];
    this.brand_name[top] = this.brand_name[moved_top];
    this.brand_value[moved_top] = tmp_value;
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
      if (this.brand_value[moved_bottom] > this.brand_value[top]) {
        this.swap(++moved_top, moved_bottom);
      }
    }
    this.swap(top, moved_top);

    this.quick_sort(top, moved_top - 1);
    this.quick_sort(moved_top + 1, bottom)
  }

  sort_ranking() {
    this.quick_sort(0, this.brand_value.length - 1);
  }

  display_filter() {
    this.brand_name.forEach((name, index) => {
      if (index >= 10) {
        if (this.bar_brand_name.includes("その他")) {
          this.bar_brand_value[10] = this.bar_brand_value[10] + this.brand_value[index];
        } else {
          this.bar_brand_name[10] = "その他";
          this.bar_brand_value[10] = this.brand_value[10];
        }
      } else {
        this.bar_brand_name.push(name);
        this.bar_brand_value.push(this.brand_value[index]);
      }
    });
  }
}
