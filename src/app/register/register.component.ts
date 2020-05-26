import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  login: boolean = false;
  writable: boolean = false;

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

  form_open() {
    this.writable = true;
  }

  form_close(event_data: boolean) {
    this.writable = event_data;
  }


}
