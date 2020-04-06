import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public session_service: SessionService) { }

  ngOnInit() {
  }

  sign_out() {
    this.session_service.sign_out();
  }
}
