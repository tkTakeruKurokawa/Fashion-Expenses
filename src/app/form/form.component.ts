import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { SessionService } from '../service/session.service';
import { Session } from '../class-interface/Session';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AngularFireStorage } from "@angular/fire/storage";
import { Data } from "../class-interface/data";
import { Autocomplete } from "../class-interface/autocomplete";
import { DataService } from '../service/data.service';
import { Options } from "../class-interface/item-categories";
import * as moment from "moment";
import { Observable, Subscription } from 'rxjs';
import { startWith, map, filter, tap } from 'rxjs/operators';
import { Output, EventEmitter } from '@angular/core';

let brands_word_count: number = 0;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @Input() data?: Data;
  register_form: FormGroup;
  file;
  file_exist: boolean = false;
  file_name: string = "";
  file_path: string = "";
  file_size: number = 0;
  file_reader = new FileReader();
  image_url: string = "";
  no_image_path: string = "../../assets/no_image.png";
  uid: string = "";
  subscriptions: Subscription[] = [];

  brand_options: Observable<Autocomplete[]>[] = [];
  options: string[] = Options;
  color: string = 'accent';

  required_error: string = 'この入力は必須です';
  max_text_error: string = '最大文字数は 100文字 です';
  max_text = 100;
  sending: boolean = false;
  brand_count: number = 1;

  @Output() event = new EventEmitter<boolean>();

  constructor(
    private session_service: SessionService,
    private data_service: DataService,
    private fb: FormBuilder,
    private afs: AngularFireStorage,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.register_form = this.fb.group({
      brand0: [this.is_data_existing() ? this.data.brand : null, [Validators.required, max_brands_word_validator]],
      item_name: [this.is_data_existing() ? this.data.item_name : null, [Validators.required, max_text_validator]],
      item_category: [this.is_data_existing() ? this.data.item_category : null, [Validators.required]],
      value: [this.is_data_existing() ? this.data.value : null, [Validators.required, max_value_validator]],
      image: [null],
    });
    if (this.is_data_existing()) {
      this.initialize_data();
    }

    this.activate_filter(0);

    this.subscriptions.push(
      this.session_service.session_state.subscribe((session: Session) => {
        if (session.login) {
          this.uid = session.uid;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  is_data_existing(): boolean {
    return (this.data === void 0) ? false : true;
  }

  initialize_data() {
    if (this.data.image !== this.no_image_path) {
      this.subscriptions.push(
        this.afs.ref(this.data.image).getDownloadURL().subscribe(image => {
          this.image_url = image;
        })
      );
    }

    const list = this.data.brand.split(" x ");
    const size = list.length;
    list.forEach((brand, index) => {
      console.log(brand, index);
      this.register_form.patchValue({ ["brand" + index]: brand });
      if (index < size - 1) {
        this.increase_brand();
      }
    });
  }

  brand_control(index: number): AbstractControl {
    return this.register_form.get('brand' + index);
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

  word_count(type: string): string {
    if (type === "brand") {
      return this.count_brands_word() + " / " + this.max_text;
    }
    if (type === "item_name") {
      return (this.register_form.get(type).value === null) ? "0 / " + this.max_text : this.register_form.get(type).value.length + " / " + this.max_text;
    }
  }

  count_brands_word(flag?: boolean): number {
    let count = 0;
    let words = 0;
    for (let index = 0; index < this.brand_count; index++) {
      if (this.existing_form(index)) {
        count += (this.register_form.get("brand" + index).value === null) ? 0 : this.register_form.get("brand" + index).value.length;
        words++;
      }
    }
    count += (words - 1) * 3;

    if (flag) {
      this.update_brands_word_count(count);
    }

    return count;
  }

  update_brands_word_count(count: number) {
    brands_word_count = count;

    for (let index = 0; index < this.brand_count; index++) {
      if (this.existing_form(index) && (this.register_form.get("brand" + index) !== null)) {
        this.register_form.get("brand" + index).updateValueAndValidity();
      }
    }
  }

  get_text_error_message(key: string): string {
    if (this.register_form.get(key).hasError("required")) {
      return this.required_error;
    }
    if (this.register_form.get(key).hasError("max_brands_word_validator")) {
      return this.max_text_error;
    }
    if (this.register_form.get(key).hasError("max_text_validator")) {
      return this.max_text_error;
    }
  }

  get_value_error_message(): string {
    if (this.register_form.get("value").hasError("required")) {
      return this.required_error;
    }
    if (this.register_form.get("value").hasError("max_value_validator")) {
      return "最大入力価格は 9,999,999,999,999円 です";
    }
  }

  existing_form(index: number) {
    return this.register_form.contains("brand" + index);
  }

  increase_brand() {
    this.brand_count++;
    this.register_form.addControl("brand" + (this.brand_count - 1), new FormControl(null, [Validators.required, max_brands_word_validator]));
    this.count_brands_word(true);
    this.activate_filter(this.brand_count - 1);
  }

  decrease_brand(index: number) {
    this.register_form.removeControl("brand" + index);
    this.count_brands_word(true);
  }

  is_invalid(): boolean {
    return (this.register_form.invalid || (this.file_size > 5000000) || this.sending);
  }

  set_image_data(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.file_exist = true;
      this.file_name = this.file["name"];
      this.file_path = "users/" + this.uid + "/" + moment().format() + "_" + this.file_name;
      this.file_size = this.file.size;
      this.file_reader.onload = (e) => {
        this.image_url = e.target["result"] as string;
      };
      this.file_reader.readAsDataURL(this.file);
    }
    console.log(this.file, this.file_path);
  }

  remove_image_data() {
    this.file = {};
    this.file_exist = false;
    this.file_name = "";
    this.file_path = "";
    this.file_size = 0;
    this.image_url = "";
  }

  activate_filter(index: number) {
    this.brand_options.push(this.register_form.get("brand" + index)
      .valueChanges
      .pipe(
        startWith(""),
        map(term => this.data_service.filter_options("brand", term)),
      ));
  }

  cancel() {
    this.reset_form();
    this.event.emit(false);
  }

  register() {
    this.submit_new_data();
    this.event.emit(false);
  }

  continue_register() {
    this.submit_new_data();
  }

  edit() {
    this.submit_edit_data();
    this.event.emit(false);
  }

  async submit_new_data() {
    this.sending = true;

    if (this.file_exist) {
      const storage_ref = this.afs.ref(this.file_path);
      const result = await storage_ref.put(this.file, { 'cacheControl': 'public, max-age=86400' });
      console.log(result);
    }

    const data = this.create_data();
    await this.data_service.set_new_data_to_firestore(data);
    this.reset_form();
    this.sending = false;
  }

  async submit_edit_data() {
    if (this.register_form.get("image").value !== null) {
      if (this.data.image !== this.no_image_path) {
        this.afs.ref(this.data.image).delete();
      }
      const storage_ref = this.afs.ref(this.file_path);
      const result = await storage_ref.put(this.file, { 'cacheControl': 'public, max-age=86400' });
      console.log(result);

    } else {
      if (!this.image_url) {
        if (this.data.image !== this.no_image_path) {
          this.afs.ref(this.data.image).delete();
        }
      }
    }

    const data = this.create_data();
    await this.data_service.set_edit_data_to_firestore(data, this.data.doc_key);
    this.reset_form();
  }

  create_data(): Data {
    const brand = this.create_brand_name();
    const image_path = this.create_image_path();

    const data: Data = {
      brand: brand,
      item_name: this.register_form.get("item_name").value,
      item_category: this.register_form.get("item_category").value,
      value: this.register_form.get("value").value,
      image: image_path
    };
    return data;
  }

  create_brand_name(): string {
    let brand = "";
    for (let index = 0; index < this.brand_count; index++) {
      if (this.existing_form(index)) {
        const name = (this.register_form.get("brand" + index).value === null) ? "" : this.register_form.get("brand" + index).value;
        if (brand.length < 1) {
          brand += name;
        } else {
          // if (name.length > 0) {
          brand += " x " + name;
          // }
        }
      }
    }

    return brand;
  }

  create_image_path(): string {
    if (this.register_form.get("image").value !== null) {
      return this.file_path;
    } else {
      if (this.is_data_existing()) {
        if (this.image_url) {
          return this.data.image;
        } else {
          return this.no_image_path;
        }
      }
      return this.no_image_path;
    }
  }

  reset_form() {
    this.register_form.reset();
    brands_word_count = 0;
    this.remove_image_data()
  }
}

function max_value_validator(form_control: AbstractControl) {
  return (form_control.value >= 10000000000000) ? { max_value_validator: true } : null;
}

function max_text_validator(form_control: AbstractControl) {
  const text: string = form_control.value;
  if (text) {
    return (form_control.value.length > 100) ? { max_text_validator: true } : null;
  } else {
    return null;
  }
}

function max_brands_word_validator() {
  return (brands_word_count > 100) ? { max_brands_word_validator: true } : null;
}