import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  brand_showed: boolean = false;
  item_showed: boolean = false;
  data_showed: boolean = false;

  constructor(
    protected router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.brand_showed = false;
        this.item_showed = false;
        this.data_showed = false;
        if (event.url.includes("brands")) {
          this.brand_showed = true;
        } else if (event.url.includes("/items")) {
          this.item_showed = true;
        } else if (event.url.includes("/data-list")) {
          this.data_showed = true;
        }
      }
    });
  }
}
