import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { Data } from "../class-interface/data";
import { DataService } from '../service/data.service';

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

  file: object = {};
  file_exist: boolean = false;
  file_name: string = "";
  file_path: string = "";

  login: boolean = false;
  uid: string = "";
  writable: boolean = false;

  constructor(
    private session_service: SessionService,
    private data_service: DataService,
    private fb: FormBuilder,
    private afs: AngularFireStorage
  ) { }

  ngOnInit() {
    this.register_form = this.fb.group({
      brand: [null, [Validators.required]],
      item_name: [null, [Validators.required]],
      item_category: [null, [Validators.required]],
      value: [null, [Validators.required]],
      image: [null],
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

  set_image_data(event) {
    this.file = event.target.files[0];
    this.file_exist = true;
    this.file_name = this.file["name"];
    this.file_path = "users/" + this.uid + "/" + this.file_name;
    console.log(this.file, this.file_path);
  }

  cancel() {
    this.reset_form();
    this.writable = false;
  }

  register() {
    this.upload_form();
    this.writable = false;
  }

  continue_register() {
    this.upload_form();
  }

  upload_form() {
    if (this.file_exist) {
      this.afs.upload(this.file_path, this.file);
    }
    const data = this.create_data();
    this.data_service.set_data_to_firestore(data);
    this.reset_form();
  }

  create_data(): Data {
    let image_path;
    if (this.register_form.get("image").value !== null) {
      image_path = this.file_path;
    } else {
      image_path = "no_image.png";
    }

    const data: Data = {
      brand: this.register_form.get("brand").value,
      item_name: this.register_form.get("item_name").value,
      item_category: this.register_form.get("item_category").value,
      value: this.register_form.get("value").value,
      image: image_path
    };
    return data;
  }

  reset_form() {
    this.register_form.reset();
    this.file = {};
    this.file_exist = false;
    this.file_name = "";
    this.file_path = "";
  }

}
