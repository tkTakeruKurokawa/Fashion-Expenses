import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  sign_up_form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session_service: SessionService,
  ) { }

  ngOnInit() {
    this.sign_up_form = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  sign_up() {
    const email = this.sign_up_form.get("email").value;
    const password = this.sign_up_form.get("password").value;
    this.session_service.sign_up(email, password);
  }

}
