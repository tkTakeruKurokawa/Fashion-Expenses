import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(protected router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!event.url.includes("#")) {
          window.scrollTo(0, 0);
        }
      }
    });
  }
}
