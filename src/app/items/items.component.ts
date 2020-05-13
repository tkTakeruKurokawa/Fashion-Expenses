import { Component, OnInit, Input } from '@angular/core';
import { Data } from '../class-interface/data';
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

  number_of_data: number = 0;

  constructor(
    private data_service: DataService
  ) { }

  ngOnInit() {
    this.data_service.get_clothes_length()
      .subscribe(length => this.number_of_data = length);
  }
}
