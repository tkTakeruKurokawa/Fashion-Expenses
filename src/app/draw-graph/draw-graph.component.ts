import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';

@Component({
  selector: 'app-draw-graph',
  templateUrl: './draw-graph.component.html',
  styleUrls: ['./draw-graph.component.scss']
})
export class DrawGraphComponent implements OnInit {
  @Input() cloth_data: Data[];
  @Input() title: string;
  @Input() category: string;
  @Input() content: string;
  @Input() display_number: number;
  @Input() show_others: boolean;

  names: string[] = [];
  values: number[] = [];
  total: number = 0;

  bar_names: string[] = [];
  bar_values: number[] = [];
  bar_data: any[] = [
    { data: this.bar_values },
  ];
  bar_options: any = {
    responsive: true,
    mainAspectRate: false,
    legend: {
      position: "bottom",
    },
  };
  bar_legend: boolean = true;
  bar_type: string = "pie";

  panel_state: boolean = false;
  name_key: string;

  constructor() { }

  ngOnInit() {
    this.make_ranking();
    this.sort_ranking();
    this.display_filter();
  }

  increment_total(data: number, index?: number) {
    if (typeof index !== 'undefined') {
      if (this.content === "value") {
        this.values[index] = this.values[index] + data;
      } else {
        this.values[index]++;
      }
    } else {
      if (this.content === "value") {
        this.total += data;
      } else {
        this.total++;
      }
    }
  }

  set_value(data: number) {
    if (this.content === "value") {
      this.values.push(data);
    } else {
      this.values.push(1);
    }
  }

  make_ranking() {
    if (this.category === "brands") {
      this.name_key = "brand";
    } else {
      this.name_key = "item_category";
    }

    this.cloth_data.forEach(data => {
      if (this.names.includes(data[this.name_key])) {
        let index = this.names.findIndex(name => name === data[this.name_key]);
        this.increment_total(data[this.content], index);
      } else {
        this.names.push(data[this.name_key]);
        this.set_value(data[this.content]);
      }
      this.increment_total(data[this.content]);
    });
  }

  swap(top: number, moved_top: number) {
    let tmp_values = this.values[top];
    let tmp_names = this.names[top];
    this.values[top] = this.values[moved_top];
    this.names[top] = this.names[moved_top];
    this.values[moved_top] = tmp_values;
    this.names[moved_top] = tmp_names;
  }

  quick_sort(top: number, bottom: number) {
    let moved_top: number;
    let moved_bottom: number;

    if (top >= bottom) {
      return;
    }

    moved_top = top;

    for (moved_bottom = top + 1; moved_bottom <= bottom; moved_bottom++) {
      if (this.values[moved_bottom] > this.values[top]) {
        this.swap(++moved_top, moved_bottom);
      }
    }
    this.swap(top, moved_top);

    this.quick_sort(top, moved_top - 1);
    this.quick_sort(moved_top + 1, bottom)
  }

  sort_ranking() {
    this.quick_sort(0, this.values.length - 1);
  }

  display_filter() {
    this.names.forEach((name, index) => {
      if (index >= 10) {
        if (this.bar_names.includes("その他")) {
          this.bar_values[10] = this.bar_values[10] + this.values[index];
        } else {
          this.bar_names[10] = "その他";
          this.bar_values[10] = this.values[10];
        }
      } else {
        this.bar_names.push(name);
        this.bar_values.push(this.values[index]);
      }
    });
  }
}
