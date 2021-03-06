import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  login: boolean = false;
  subscription: Subscription;

  constructor(
    private session_service: SessionService,
  ) { }

  ngOnInit() {
    this.subscription = this.session_service.session_state.subscribe((session: Session) => {
      if (session) {
        this.login = session.login;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sign_out() {
    this.session_service.sign_out();
  }
}
