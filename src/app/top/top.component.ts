import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  titles: string[] = ["ブランドごとの消費額", "ブランドごとの所持数", "アイテムカテゴリごとの消費額", "アイテムカテゴリごとの所持数"];
  categories: string[] = ["brand", "brand", "item_category", "item_category"];
  contents: string[] = ["value", "item_category", "value", "item_category"];
  display_number: number = 3;
  show_others: boolean = false;

  constructor() { }

  ngOnInit() { }
}
