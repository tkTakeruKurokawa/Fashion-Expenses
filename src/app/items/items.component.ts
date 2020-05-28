import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  display_number: number = 3;
  show_others: boolean = true;

  titles: string[] = ["アイテムカテゴリごとの消費額", "アイテムカテゴリごとの所持数"];
  categories: string[] = ["item_category", "item_category"];
  contents: string[] = ["value", "item_category"];

  constructor() { }

  ngOnInit() { }
}
