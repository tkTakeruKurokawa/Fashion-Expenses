import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Data } from '../class-interface/data';
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';

class DrawGraph {
  clothes: Data[] = [];
  names: Array<string[]> = [[], [], [], []];
  values: Array<number[]> = [[], [], [], []];
  total: Array<number> = [0, 0, 0, 0];

  bar_names: Array<string[]> = [[], [], [], []];
  bar_values: Array<number[]> = [[], [], [], []];
  bar_colors: Array<any> = [
    {
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(231, 233, 237)',
        'rgb(75, 192, 192)',
        'rgb(151, 187, 205)',
        'rgb(220, 220, 220)',
        'rgb(247, 70, 74)',
        'rgb(70, 191, 189)',
        'rgb(253, 180, 92)',
        'rgb(148, 159, 177)'
      ]
    },
  ];
  bar_options: any = {
    responsive: true,
    // mainAspectRate: false,
    legend: {
      position: "bottom",
    },
  };
  bar_legend: boolean = true;
  bar_type: string = "pie";

  panel_state: boolean = false;
  url_categories: string[] = [];
  number_of_data: number;

  constructor() {
  }
}

@Component({
  selector: 'app-draw-graph',
  templateUrl: './draw-graph.component.html',
  styleUrls: ['./draw-graph.component.scss']
})
export class DrawGraphComponent implements OnInit, OnDestroy {
  @Input() titles: string[];
  @Input() categories: string[];
  @Input() contents: string[];
  @Input() display_number: number;
  @Input() show_others: boolean;

  draw_graph: DrawGraph = new DrawGraph();
  subscription: Subscription;

  constructor(
    private data_service: DataService,
  ) { }

  ngOnInit() {
    this.subscription = this.data_service.get_cloth_data_subject()
      .subscribe(data => {
        this.draw_graph = new DrawGraph();

        if (data) {
          this.draw_graph.clothes = data;
          this.draw_graph.number_of_data = data.length;

          this.make_ranking();
          this.sort_ranking();
          this.display_filter();
        }
      });

  }

  make_ranking() {
    this.contents.forEach((content, number) => {
      let category = this.categories[number];
      this.draw_graph.url_categories.push(this.adjust_category(category));

      this.draw_graph.clothes.forEach(data => {
        if (this.draw_graph.names[number].includes(data[category])) {
          let index = this.draw_graph.names[number].findIndex(name => name === data[category]);
          this.increment_existing_value(number, content, data[content], index);
        } else {
          this.draw_graph.names[number].push(data[category]);
          this.set_new_value(number, content, data[content]);
        }
        this.increment_existing_value(number, content, data[content]);
      });
    });
  }

  adjust_category(category: string): string {
    if (category === "brand") {
      return "brands";
    }
    if (category === "item_category") {
      return "items";
    }
  }

  increment_existing_value(number: number, content: string, data: number, index?: number) {
    if (typeof index !== 'undefined') {
      if (content === "value") {
        this.draw_graph.values[number][index] = this.draw_graph.values[number][index] + data;
      } else {
        this.draw_graph.values[number][index]++;
      }
    } else {
      if (content === "value") {
        this.draw_graph.total[number] += data;
      } else {
        this.draw_graph.total[number]++;
      }
    }
  }

  set_new_value(number: number, content: string, data: number) {
    if (content === "value") {
      this.draw_graph.values[number].push(data);
    } else {
      this.draw_graph.values[number].push(1);
    }
  }

  sort_ranking() {
    this.draw_graph.names.forEach((names, number) => {
      this.quick_sort(number, 0, this.draw_graph.values[number].length - 1);
    });
  }

  quick_sort(number: number, top: number, bottom: number) {
    let moved_top: number;
    let moved_bottom: number;

    if (top >= bottom) {
      return;
    }

    moved_top = top;

    for (moved_bottom = top + 1; moved_bottom <= bottom; moved_bottom++) {
      if (this.draw_graph.values[number][moved_bottom] > this.draw_graph.values[number][top]) {
        this.swap(number, ++moved_top, moved_bottom);
      }
    }
    this.swap(number, top, moved_top);

    this.quick_sort(number, top, moved_top - 1);
    this.quick_sort(number, moved_top + 1, bottom)
  }

  swap(number: number, top: number, moved_top: number) {
    let tmp_values = this.draw_graph.values[number][top];
    let tmp_names = this.draw_graph.names[number][top];
    this.draw_graph.values[number][top] = this.draw_graph.values[number][moved_top];
    this.draw_graph.names[number][top] = this.draw_graph.names[number][moved_top];
    this.draw_graph.values[number][moved_top] = tmp_values;
    this.draw_graph.names[number][moved_top] = tmp_names;
  }

  display_filter() {
    this.draw_graph.names.forEach((names, first_number) => {
      names.forEach((name, second_number) => {
        if (second_number >= 10) {
          if (this.draw_graph.bar_names[first_number].includes("その他")) {
            this.draw_graph.bar_values[first_number][10] = this.draw_graph.bar_values[first_number][10] + this.draw_graph.values[first_number][second_number];
          } else {
            this.draw_graph.bar_names[first_number][10] = "その他";
            this.draw_graph.bar_values[first_number][10] = this.draw_graph.values[first_number][10];
          }
        } else {
          this.draw_graph.bar_names[first_number].push(name);
          this.draw_graph.bar_values[first_number].push(this.draw_graph.values[first_number][second_number]);
        }
      })
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
