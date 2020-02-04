import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';

@Component({
  selector: 'app-items-number',
  templateUrl: './items-number.component.html',
  styleUrls: ['./items-number.component.scss']
})
export class ItemsNumberComponent implements OnInit {
  @Input() data_list: Data[];
  @Input() display_number: number;
  @Input() show_others: boolean;

  item_name: string[] = [];
  item_number: number[] = [];
  total_number: number = 0;

  bar_item_name: string[] = [];
  bar_item_number: number[] = [];
  bar_data: any[] = [
    { data: this.bar_item_number, label: "消費額" },
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
        this.item_number[index] = this.item_number[index] + 1;
      } else {
        this.item_name.push(data.item_category);
        this.item_number.push(1);
      }
      this.total_number++;
    });
  }

  swap(top: number, moved_top: number) {
    let tmp_number = this.item_number[top];
    let tmp_name = this.item_name[top];
    this.item_number[top] = this.item_number[moved_top];
    this.item_name[top] = this.item_name[moved_top];
    this.item_number[moved_top] = tmp_number;
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
      if (this.item_number[moved_bottom] > this.item_number[top]) {
        this.swap(++moved_top, moved_bottom);
      }
    }
    this.swap(top, moved_top);

    this.quick_sort(top, moved_top - 1);
    this.quick_sort(moved_top + 1, bottom)
  }

  sort_ranking() {
    this.quick_sort(0, this.item_number.length - 1);
  }

  display_filter() {
    this.item_name.forEach((name, index) => {
      if (index >= 10) {
        if (this.bar_item_name.includes("その他")) {
          this.bar_item_number[10] = this.bar_item_number[10] + this.item_number[index];
        } else {
          this.bar_item_name[10] = "その他";
          this.bar_item_number[10] = this.item_number[10];
        }
      } else {
        this.bar_item_name.push(name);
        this.bar_item_number.push(this.item_number[index]);
      }
    });
  }
}
