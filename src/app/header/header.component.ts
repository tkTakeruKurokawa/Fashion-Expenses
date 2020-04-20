import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../Session';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  login: boolean = false;

  constructor(public session_service: SessionService) { }

  ngOnInit() {
    this.session_service.session_state.subscribe((session: Session) => {
      if (session) {
        this.login = session.login;
      }
    });
  }

  sign_out() {
    this.session_service.sign_out();
  }
}
