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
  file_reader = new FileReader();
  image_url: string = "";
  uid: string = "";
  subscriptions: Subscription[] = [];

  brand_options: Observable<Autocomplete[]>[] = [];
  options: string[] = Options;
  color: string = 'accent';

  error_message: string = 'この入力は必須です';
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
      brand0: [this.is_data_existing() ? this.data.brand : null, [Validators.required]],
      item_name: [this.is_data_existing() ? this.data.item_name : null, [Validators.required]],
      item_category: [this.is_data_existing() ? this.data.item_category : null, [Validators.required]],
      value: [this.is_data_existing() ? this.data.value : null, [Validators.required]],
      image: [null],
    });
    if (this.is_data_existing()) {
      if (this.data.image !== "no_image.png") {
        this.subscriptions.push(
          this.afs.ref(this.data.image).getDownloadURL().subscribe(image => {
            this.image_url = image;
          })
        );
      }
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

  existing_form(index: number) {
    return this.register_form.contains("brand" + index);
  }

  increase_brand() {
    this.brand_count++;
    this.register_form.addControl("brand" + (this.brand_count - 1), new FormControl(null, [Validators.required]));
    this.activate_filter(this.brand_count - 1);
  }

  decrease_brand(index: number) {
    this.register_form.removeControl("brand" + index);
  }

  is_invalid(): boolean {
    return (this.register_form.invalid || this.sending);
  }

  set_image_data(event) {
    // console.log(event);

    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.file_exist = true;
      this.file_name = this.file["name"];
      this.file_path = "users/" + this.uid + "/" + moment().format() + "_" + this.file_name;
      this.file_reader.onload = (e) => {
        this.image_url = e.target["result"] as string;
      };
      this.file_reader.readAsDataURL(this.file);
      // console.log(this.file_reader);
    }

    console.log(this.file, this.file_path);
  }

  remove_image_data() {
    this.file = {};
    this.file_exist = false;
    this.file_name = "";
    this.file_path = "";
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
    // console.log(this.register_form);
    if (this.register_form.get("image").value !== null) {
      if (this.data.image !== "no_image.png") {
        this.afs.ref(this.data.image).delete();
      }
      const storage_ref = this.afs.ref(this.file_path);
      const result = await storage_ref.put(this.file, { 'cacheControl': 'public, max-age=86400' });
      console.log(result);

    } else {
      if (!this.image_url) {
        if (this.data.image !== "no_image.png") {
          this.afs.ref(this.data.image).delete();
        }
      }
    }

    const data = this.create_data();
    await this.data_service.set_edit_data_to_firestore(data, this.data.doc_key);
    this.reset_form();
  }

  create_data(): Data {
    let brand = "";
    let count = 0;
    for (let index = 0; index < this.brand_count; index++) {
      if (this.register_form.contains("brand" + index)) {
        if (count === 0) {
          brand += this.register_form.get("brand" + index).value;
          count++;
        } else {
          brand += " x " + this.register_form.get("brand" + index).value;
        }
      }
    }

    let image_path: string;
    if (this.register_form.get("image").value !== null) {
      image_path = this.file_path;
    } else {
      if (this.is_data_existing()) {
        if (this.image_url) {
          image_path = this.data.image;
        } else {
          image_path = "no_image.png";
        }
      }
      image_path = "no_image.png";
    }

    const data: Data = {
      brand: brand,
      item_name: this.register_form.get("item_name").value,
      item_category: this.register_form.get("item_category").value,
      value: this.register_form.get("value").value,
      image: image_path
    };
    return data;
  }

  reset_form() {
    this.register_form.reset();
    this.remove_image_data()
  }
}
