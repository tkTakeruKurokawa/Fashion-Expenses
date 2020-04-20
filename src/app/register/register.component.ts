import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../Session';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  login: boolean = false;

  constructor(private session_service: SessionService) { }

  ngOnInit() {
    this.session_service.session_state.subscribe((session: Session) => {
      if (session) {
        console.log(session);
        this.login = session.login;
      }
    });
  }

}
