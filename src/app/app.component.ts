import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SessionService } from './service/session.service';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data;

  constructor(
    protected router: Router,
    private session_service: SessionService,
    private data_service: DataService
  ) {
    this.data_service.get_data_from_firestore();

    this.session_service.check_sign_in();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!event.url.includes("item_category")) {
          window.scrollTo(0, 0);
        }
      }
    });
  }

}
