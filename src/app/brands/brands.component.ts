import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  @Input() display_number: number = 5;
  @Input() show_others: boolean = true;

  titles: string[] = ["ブランドごとの消費額", "ブランドごとの所持数"];
  categories: string[] = ["brand", "brand"];
  contents: string[] = ["value", "item_category"];

  constructor() { }

  ngOnInit() { }
}
