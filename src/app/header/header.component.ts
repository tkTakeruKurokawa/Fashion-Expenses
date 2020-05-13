import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';
import { DataService } from '../service/data.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  login: boolean = false;

  constructor(
    private session_service: SessionService,
    private data_service: DataService,
  ) { }

  ngOnInit() {
    this.session_service.session_state.subscribe((session: Session) => {
      if (session) {
        this.login = session.login;
        // this.data_service.get_data_from_firestore(session.uid);
      }
    });
  }

  sign_out() {
    this.session_service.sign_out();
  }
}
