import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';
import { Observable, Subscription } from 'rxjs';
import { DataService } from "../service/data.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  login: boolean = false;

  constructor(
    private session_service: SessionService,
    private data_service: DataService,
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

  form_writable(): boolean {
    return this.data_service.get_form_writable();
  }

  initialize_form() {
    this.data_service.set_edit_data(undefined);
  }
}
