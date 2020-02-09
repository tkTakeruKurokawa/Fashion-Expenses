import { Component, OnInit } from '@angular/core';
import { Data } from '../data';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

class Detail {
  title: string;
  cloth_data: Data[];
  total: number[] = [0, 0];
  panel_state: boolean = false;

  params: string[] = [];
  category: string;

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
export class DrawDetailGraphComponent implements OnInit {
  detail: Detail;

  constructor(
    private data_service: DataService,
    private active_router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.get_data_type();
  }

  get_data_type() {
    this.active_router.pathFromRoot.forEach(urls => urls.url.subscribe(url => {
      this.detail = new Detail();

      url.forEach(params => {
        if (params.path.length >= 1) {
          this.detail.params.push(params.path);
        }
      });

      this.define_category();
      this.get_data_list();
      this.make_ranking();
      this.sort_ranking();
    }));
    // this.detail.active_router.paramMap.subscribe(param => console.log(param));
    // console.log(this.detail.active_router);
  }

  define_category() {
    if (this.detail.params[0] === "brands") {
      this.detail.category = "item";
    } else {
      this.detail.category = "brand";
    }
  }

  get_data_list() {
    let category;
    if (this.detail.params[0] === "brands") {
      category = "brand";
    } else {
      category = "item";
    }

    this.data_service.get_cloth_data().subscribe(cloth_data => {
      this.detail.cloth_data = cloth_data.filter(data => data[category].replace(/[-\/\\^$*+?.()|\[\]{}\s]+/g, "") === this.detail.params[1]);
      this.detail.title = this.detail.cloth_data.map(data => data[category])[0];
    });

    this.detail.cloth_data.sort((a, b) => b["value"] - a["value"]);
  }

  add_bar_data(data: Data) {
    this.detail.bar_value_name.push(data[this.detail.category]);
    this.detail.bar_number_name.push(data[this.detail.category]);
    this.detail.bar_value.push(data["value"]);
    this.detail.bar_number.push(1);
  }

  increment_bar_data(data: Data, index: number) {
    this.detail.bar_value[index] += data["value"];
    this.detail.bar_number[index]++;
  }

  make_ranking() {
    this.detail.cloth_data.forEach(data => {
      if (this.detail.bar_value_name.includes(data[this.detail.category])) {
        let index = this.detail.bar_value_name.findIndex(name => name === data[this.detail.category]);
        this.increment_bar_data(data, index);
      } else {
        this.add_bar_data(data);
      }
      this.detail.total[0] += data["value"];
      this.detail.total[1]++;
    });
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
}
