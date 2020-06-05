import { Component, OnInit, OnDestroy } from '@angular/core';
import { Data } from '../class-interface/data';
import { DataService } from '../service/data.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';

class Detail {
  title: string;
  cloth_data: Data[];
  total: number[] = [0, 0];

  bar_value: number[] = [];
  bar_value_name: string[] = [];
  bar_number: number[] = [];
  bar_number_name: string[] = [];
  bar_value_data: any[] = [
    { data: this.bar_value },
  ];
  bar_number_data: any[] = [
    { data: this.bar_number },
  ];
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
    mainAspectRate: false,
    legend: {
      position: "bottom",
    },
  };
  bar_legend: boolean = true;
  bar_type: string = "pie";

  constructor() {
  }
}

@Component({
  selector: 'app-draw-detail-graph',
  templateUrl: './draw-detail-graph.component.html',
  styleUrls: ['./draw-detail-graph.component.scss']
})
export class DrawDetailGraphComponent implements OnInit, OnDestroy {
  detail: Detail = new Detail();

  params: string[] = [];
  category: string;
  data_count: number;

  subscriptions: Subscription[] = [];

  constructor(
    private data_service: DataService,
    private active_router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.get_data_type();
  }

  get_data_type() {
    this.active_router.pathFromRoot.forEach(urls => {

      this.subscriptions.push(
        urls.url
          .pipe(filter(url => url.length > 1))
          .subscribe(url => {
            url.forEach((params, index) => {
              if (params.path.length > 1) {
                this.params[index] = params.path;
              }
            });

            this.define_category();
            this.get_data_list();
          })
      );
    });
  }

  define_category() {
    if (this.params[0] === "brands") {
      this.category = "item_category";
    } else {
      this.category = "brand";
    }
  }

  get_data_list() {
    let category;
    if (this.params[0] === "brands") {
      category = "brand";
    } else {
      category = "item_category";
    }

    this.subscriptions.push(this.data_service.get_cloth_data_subject().subscribe(cloth_data => {
      if (cloth_data) {
        this.detail = new Detail();
        this.create_cloth_data(cloth_data, category);

        this.data_count = this.detail.cloth_data.length;
        this.detail.cloth_data.sort((a, b) => b["value"] - a["value"]);

        this.make_ranking();
        this.sort_ranking();
      }
    })
    );
  }

  create_cloth_data(cloth_data: Data[], category: string) {
    this.detail.cloth_data = cloth_data.filter(data => {
      const clothes: string = data[category];

      if (clothes.replace(/[-\/\\^$*+?.()|\[\]{}\s]+/g, "") === this.params[1]) {
        this.detail.title = clothes;
        return true;
      }

      for (const cloth of clothes.split(" x ")) {
        if (cloth.replace(/[-\/\\^$*+?.()|\[\]{}\s]+/g, "") === this.params[1]) {
          this.detail.title = cloth;
          return true;
        }
      }

      return false;
    });
  }

  make_ranking() {
    this.detail.cloth_data.forEach(data => {
      if (this.detail.bar_value_name.includes(data[this.category])) {
        let index = this.detail.bar_value_name.findIndex(name => name === data[this.category]);
        this.increment_bar_data(data, index);
      } else {
        this.add_bar_data(data);
      }
      this.detail.total[0] += data["value"];
      this.detail.total[1]++;
    });
  }

  increment_bar_data(data: Data, index: number) {
    this.detail.bar_value[index] += data["value"];
    this.detail.bar_number[index]++;
  }

  add_bar_data(data: Data) {
    this.detail.bar_value_name.push(data[this.category]);
    this.detail.bar_number_name.push(data[this.category]);
    this.detail.bar_value.push(data["value"]);
    this.detail.bar_number.push(1);
  }

  set_lists(type: string, content: string, list) {
    if (type === "value") {
      if (content === "value") {
        this.detail.bar_value = list;
      } else {
        this.detail.bar_value_name = list;
      }
    } else {
      if (content === "value") {
        this.detail.bar_number = list;
      } else {
        this.detail.bar_number_name = list;
      }
    }
  }

  get_lists(type: string, content: string) {
    if (type === "value") {
      if (content === "value") {
        return this.detail.bar_value;
      } else {
        return this.detail.bar_value_name;
      }
    } else {
      if (content === "value") {
        return this.detail.bar_number;
      } else {
        return this.detail.bar_number_name;
      }
    }
  }

  swap(type: string, top: number, moved_top: number) {
    let values = this.get_lists(type, "value");
    let names = this.get_lists(type, "name");
    let tmp_values = values[top];
    let tmp_names = names[top];

    values[top] = values[moved_top];
    names[top] = names[moved_top];
    values[moved_top] = tmp_values;
    names[moved_top] = tmp_names;

    this.set_lists(type, "value", values);
    this.set_lists(type, "name", names);
  }

  quick_sort(type: string, top: number, bottom: number) {
    let values = this.get_lists(type, "value");
    let moved_top: number;
    let moved_bottom: number;

    if (top >= bottom) {
      return;
    }

    moved_top = top;

    for (moved_bottom = top + 1; moved_bottom <= bottom; moved_bottom++) {
      if (values[moved_bottom] > values[top]) {
        this.swap(type, ++moved_top, moved_bottom);
      }
    }
    this.swap(type, top, moved_top);

    this.quick_sort(type, top, moved_top - 1);
    this.quick_sort(type, moved_top + 1, bottom)
  }

  sort_ranking() {
    this.quick_sort("value", 0, this.detail.bar_value.length - 1);
    this.quick_sort("number", 0, this.detail.bar_number.length - 1);
  }

  is_observable(url: string | Observable<string>): boolean {
    return (typeof url === "string" ? false : true);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
