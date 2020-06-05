import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  sign_up_form: FormGroup;

  bar_names = ["COMME des GARCONS", "YOHJI YAMAMOTO", "ISSEY MIYAKE"];
  bar_values = [300000, 200000, 100000];
  bar_options: any = {
    responsive: true,
    legend: {
      position: "bottom",
    },
  };
  background_color = [
    'rgb(255, 99, 132, 0.65)',
    'rgb(54, 162, 235, 0.65)',
    'rgb(255, 206, 86, 0.65)',
    'rgb(231, 233, 237, 0.65)',
    'rgb(75, 192, 192, 0.65)',
    'rgb(151, 187, 205, 0.65)',
    'rgb(220, 220, 220, 0.65)',
    'rgb(247, 70, 74, 0.65)',
    'rgb(70, 191, 189, 0.65)',
    'rgb(253, 180, 92, 0.65)',
    'rgb(148, 159, 177, 0.65)'
  ];
  bar_legend = true;
  bar_type = "pie";

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
