import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  sign_in_form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session_service: SessionService,
  ) { }

  ngOnInit() {
    this.sign_in_form = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[A-Za-z0-9]*$/)]]
    });
  }

  sign_in() {
    const email = this.sign_in_form.get("email").value;
    const password = this.sign_in_form.get("password").value;
    this.session_service.sign_in(email, password);
  }

}
