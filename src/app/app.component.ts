import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Data } from "./data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: Data;

  constructor(
    protected router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!event.url.includes("item_category")) {
          window.scrollTo(0, 0);
        }
      }
    });


    // this.db.collection("users").doc("Ml3PWz4WPhIlsvdUIiNH").collection("clothes").doc<Data>("lVzaafqGcVxgI1JQDw89").valueChanges().subscribe(data => console.log(data));
    // this.db.doc<Data>("users/Ml3PWz4WPhIlsvdUIiNH/clothes/lVzaafqGcVxgI1JQDw89").valueChanges().subscribe(data => console.log(data));
  }
}
