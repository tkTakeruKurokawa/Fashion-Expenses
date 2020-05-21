import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { Data } from "../class-interface/data";
import { Autocomplete } from "../class-interface/autocomplete";
import { DataService } from '../service/data.service';
import { Options } from "../class-interface/item-categories";
import * as moment from "moment";
import { Observable } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  register_form: FormGroup;
  file: object = {};
  file_exist: boolean = false;
  file_name: string = "";
  file_path: string = "";
  uid: string = "";

  brand_options: Observable<Autocomplete[]>;
  options: string[] = Options;
  color: string = 'accent';
  error_message: string = 'この入力は必須です';
  login: boolean = false;
  writable: boolean = false;
  sending: boolean = false;
  categories = ["ブランド", "アイテム"];

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

    this.brand_options = this.register_form.get("brand")
      .valueChanges
      .pipe(
        startWith(""),
        map(term => this.data_service.filter_options("brand", term)),
      );
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
    this.file_path = "users/" + this.uid + "/" + moment().format() + "_" + this.file_name;
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

  async upload_form() {
    this.sending = true;

    if (this.file_exist) {
      const storage_ref = this.afs.ref(this.file_path);
      const result = await storage_ref.put(this.file, { 'cacheControl': 'public, max-age=86400' });
      console.log(result);
    }

    const data = this.create_data();
    await this.data_service.set_data_to_firestore(data);
    this.reset_form();
    this.sending = false;
  }

  create_data(): Data {
    let image_path: string;
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
