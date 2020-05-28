import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  display_number: number = 3;
  show_others: boolean = true;

  titles: string[] = ["ブランドごとの消費額", "ブランドごとの所持数"];
  categories: string[] = ["brand", "brand"];
  contents: string[] = ["value", "item_category"];

  constructor() { }

  ngOnInit() { }
}
