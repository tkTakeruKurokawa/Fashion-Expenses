import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../data';
import { DataService } from '../service/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  @Input() display_number: number = 5;
  @Input() show_others: boolean = true;

  titles: string[] = ["アイテムカテゴリごとの消費額", "アイテムカテゴリごとの所持数"];
  category: string = "items";
  contents: string[] = ["value", "item_category"];

  constructor(private data_service: DataService) { }

  ngOnInit() {
    // this.get_data_list();
  }

  // get_data_list() {
  //   this.data_service.get_cloth_data().subscribe(cloth_data => {
  //     this.cloth_data = cloth_data;
  //   });
  // }
}
