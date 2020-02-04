import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';

@Component({
  selector: 'app-items-value',
  templateUrl: './items-value.component.html',
  styleUrls: ['./items-value.component.scss']
})
export class ItemsValueComponent implements OnInit {
  @Input() data_list: Data[];
  @Input() display_number: number;
  @Input() show_others: boolean;

  item_name: string[] = [];
  item_value: number[] = [];
  total_value: number = 0;

  bar_item_name: string[] = [];
  bar_item_value: number[] = [];
  bar_data: any[] = [
    { data: this.bar_item_value, label: "消費額" },
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
      if (this.item_name.includes(data.item_category)) {
        let index = this.item_name.findIndex(name => name === data.item_category);
        this.item_value[index] = this.item_value[index] + data.value;
      } else {
        this.item_name.push(data.item_category);
        this.item_value.push(data.value);
      }
      this.total_value += data.value;
    });
  }

  swap(top: number, moved_top: number) {
    let tmp_value = this.item_value[top];
    let tmp_name = this.item_name[top];
    this.item_value[top] = this.item_value[moved_top];
    this.item_name[top] = this.item_name[moved_top];
    this.item_value[moved_top] = tmp_value;
    this.item_name[moved_top] = tmp_name;
  }

  quick_sort(top: number, bottom: number) {
    let moved_top: number;
    let moved_bottom: number;

    if (top >= bottom) {
      return;
    }

    moved_top = top;

    for (moved_bottom = top + 1; moved_bottom <= bottom; moved_bottom++) {
      if (this.item_value[moved_bottom] > this.item_value[top]) {
        this.swap(++moved_top, moved_bottom);
      }
    }
    this.swap(top, moved_top);

    this.quick_sort(top, moved_top - 1);
    this.quick_sort(moved_top + 1, bottom)
  }

  sort_ranking() {
    this.quick_sort(0, this.item_value.length - 1);
  }

  display_filter() {
    this.item_name.forEach((name, index) => {
      if (index >= 10) {
        if (this.bar_item_name.includes("その他")) {
          this.bar_item_value[10] = this.bar_item_value[10] + this.item_value[index];
        } else {
          this.bar_item_name[10] = "その他";
          this.bar_item_value[10] = this.item_value[10];
        }
      } else {
        this.bar_item_name.push(name);
        this.bar_item_value.push(this.item_value[index]);
      }
    });
  }
}
