import { Component, OnInit, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { Data } from '../class-interface/data';
import { DataService } from '../service/data.service';
import { Observable, pipe, of } from 'rxjs';
import { take, switchMap, skip, filter, tap, switchMapTo } from 'rxjs/operators';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';

class DrawGraph {
  clothes: Data[] = [];
  names: string[] = [];
  values: number[] = [];
  total: number = 0;

  bar_names: string[] = [];
  bar_values: number[] = [];
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

  panel_state: boolean = false;
  name_key: string;

  constructor() {
  }
}

@Component({
  selector: 'app-draw-graph',
  templateUrl: './draw-graph.component.html',
  styleUrls: ['./draw-graph.component.scss']
})
export class DrawGraphComponent implements OnInit {
  @Input() title: string;
  @Input() category: string;
  @Input() content: string;
  @Input() display_number: number;
  @Input() show_others: boolean;

  draw_graph: DrawGraph = new DrawGraph();

  constructor(
    private data_service: DataService,
    private zone: NgZone,
    private change_detector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // this.cloth_data
    //   .pipe(
    //     take(1)
    //   )
    //   .subscribe(data => {
    //     console.log(data);
    //     this.clothes = data
    //     this.make_ranking();
    //     this.sort_ranking();
    //     this.display_filter();
    //     console.log(this.bar_names);
    //   });
    // this.clothes = this.cloth_data;
    // this.data_service.get_cloth_data().subscribe(data => this.clothes = data);

    this.data_service.get_cloth_data()
      // .pipe(take(1))
      // .pipe(switchMap((data: Data[]) => this.set_clothes(data)))
      .subscribe(data => {
        this.draw_graph = new DrawGraph();
        this.draw_graph.clothes = data;
        this.make_ranking();
        this.sort_ranking();
        this.display_filter();
      });

    // if (typeof this.data_service.get_cloth_data() === 'undefined') {
    //   setTimeout(() => {
    //     this.data_service.get_cloth_data()
    //       .subscribe(data => {
    //         this.clothes = data;
    //         this.make_ranking();
    //         this.sort_ranking();
    //         this.display_filter();
    //         // this.flag = true;
    //         // this.change_detector.detectChanges();
    //         // this.data_service.next_subject();
    //         console.log(this.clothes);
    //       })
    //   }, 500);
    // } else {
    //   this.data_service.get_cloth_data()
    //     .subscribe(data => {
    //       this.clothes = data;
    //       this.make_ranking();
    //       this.sort_ranking();
    //       this.display_filter();
    //       // this.flag = true;
    //       // this.change_detector.detectChanges();
    //       // this.data_service.next_subject();
    //       console.log(this.clothes);
    //     })
    // }



    // this.zone.run(() => {
    //   this.make_ranking();
    //   this.sort_ranking();
    //   this.display_filter();
    // });


  }

  set_clothes(data: Data[]): Observable<Data[]> {
    console.log(this.draw_graph.clothes.length, data.length);

    if (this.draw_graph.clothes.length !== data.length) {
      return of(data);
    } else {
      return of();
    }
  }

  make_ranking() {
    if (this.category === "brands") {
      this.draw_graph.name_key = "brand";
    } else {
      this.draw_graph.name_key = "item_category";
    }

    this.draw_graph.clothes.forEach(data => {
      if (this.draw_graph.names.includes(data[this.draw_graph.name_key])) {
        let index = this.draw_graph.names.findIndex(name => name === data[this.draw_graph.name_key]);
        this.increment_total(data[this.content], index);
      } else {
        this.draw_graph.names.push(data[this.draw_graph.name_key]);
        this.set_value(data[this.content]);
      }
      this.increment_total(data[this.content]);
    });
  }

  increment_total(data: number, index?: number) {
    if (typeof index !== 'undefined') {
      if (this.content === "value") {
        this.draw_graph.values[index] = this.draw_graph.values[index] + data;
      } else {
        this.draw_graph.values[index]++;
      }
    } else {
      if (this.content === "value") {
        this.draw_graph.total += data;
      } else {
        this.draw_graph.total++;
      }
    }
  }

  set_value(data: number) {
    if (this.content === "value") {
      this.draw_graph.values.push(data);
    } else {
      this.draw_graph.values.push(1);
    }
  }

  swap(top: number, moved_top: number) {
    let tmp_values = this.draw_graph.values[top];
    let tmp_names = this.draw_graph.names[top];
    this.draw_graph.values[top] = this.draw_graph.values[moved_top];
    this.draw_graph.names[top] = this.draw_graph.names[moved_top];
    this.draw_graph.values[moved_top] = tmp_values;
    this.draw_graph.names[moved_top] = tmp_names;
  }

  quick_sort(top: number, bottom: number) {
    let moved_top: number;
    let moved_bottom: number;

    if (top >= bottom) {
      return;
    }

    moved_top = top;

    for (moved_bottom = top + 1; moved_bottom <= bottom; moved_bottom++) {
      if (this.draw_graph.values[moved_bottom] > this.draw_graph.values[top]) {
        this.swap(++moved_top, moved_bottom);
      }
    }
    this.swap(top, moved_top);

    this.quick_sort(top, moved_top - 1);
    this.quick_sort(moved_top + 1, bottom)
  }

  sort_ranking() {
    this.quick_sort(0, this.draw_graph.values.length - 1);
  }

  display_filter() {
    this.draw_graph.names.forEach((name, index) => {
      if (index >= 10) {
        if (this.draw_graph.bar_names.includes("その他")) {
          this.draw_graph.bar_values[10] = this.draw_graph.bar_values[10] + this.draw_graph.values[index];
        } else {
          this.draw_graph.bar_names[10] = "その他";
          this.draw_graph.bar_values[10] = this.draw_graph.values[10];
        }
      } else {
        this.draw_graph.bar_names.push(name);
        this.draw_graph.bar_values.push(this.draw_graph.values[index]);
      }
    });
  }
}
