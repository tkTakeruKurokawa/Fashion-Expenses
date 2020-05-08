import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../Session';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  register_form: FormGroup;
  options: Array<string> = [
    "トップス",
    "ジャケット",
    "アウター",
    "パンツ",
    "シューズ",
    "キャップ/ハット",
    "アクセサリー",
    "バッグ",
    "レッグウェア",
    "アンダーウェア",
    "アイウェア",
    "ファッション雑貨",
    "スーツ/ネクタイ",
    "財布/小物",
    "時計",
    "水着/着物・浴衣",
    "その他"
  ];
  color: string = 'accent';
  error_message: string = 'この入力は必須です';
  file_name: string = "";

  login: boolean = false;
  uid: string = "";
  writable: boolean = false;

  constructor(
    private session_service: SessionService,
    private fb: FormBuilder,
    private afs: AngularFireStorage
  ) { }

  ngOnInit() {
    this.register_form = this.fb.group({
      brand: ['', [Validators.required]],
      item_name: ['', [Validators.required]],
      item_category: ['', [Validators.required]],
      value: ['', [Validators.required]],
      image: [''],
    });

    this.session_service.session_state.subscribe((session: Session) => {
      if (session) {
        this.login = session.login;
        this.uid = session.uid;
      }
    });
  }

  brand_control(): AbstractControl {
    return this.register_form.get('brand');
  }

  item_name_control(): AbstractControl {
    return this.register_form.get('item_name');
  }

  item_category_control(): AbstractControl {
    return this.register_form.get('item_category');
  }

  value_control(): AbstractControl {
    return this.register_form.get('value');
  }

  button_click() {
    this.writable = true;
  }

  upload(event) {
    // this.session_service.session_state.subscribe((session: Session) => {
    const file = event.target.files[0];
    this.file_name = file.name;
    const file_path = this.uid + "/" + this.file_name;
    this.afs.upload(file_path, file);
  }

  cancel() {
    this.writable = false;
  }

  register() {
    console.log(this.register_form.get("brand").value);
    this.writable = false;
  }

  continue_register() {
    console.log(this.register_form.get("brand").value);
  }

}
