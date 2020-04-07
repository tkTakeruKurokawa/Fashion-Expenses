import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Data } from "./data";
import { Session } from "./Session";
import { SessionService } from './service/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: Data;
  login = false;

  constructor(
    protected router: Router,
    private session_service: SessionService,
  ) {
    this.session_service.check_sign_in();
    this.session_service.session_state.subscribe((session: Session) => {
      if (session) {
        console.log(session);
        this.login = session.login;
      }
    });


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!event.url.includes("item_category")) {
          window.scrollTo(0, 0);
        }
      }
    });
  }

  // this.db.collection("users").doc("Ml3PWz4WPhIlsvdUIiNH").collection("clothes").doc<Data>("lVzaafqGcVxgI1JQDw89").valueChanges().subscribe(data => console.log(data));
  // this.db.doc<Data>("users/Ml3PWz4WPhIlsvdUIiNH/clothes/lVzaafqGcVxgI1JQDw89").valueChanges().subscribe(data => console.log(data));
}
