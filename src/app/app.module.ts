import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { HeaderComponent } from './header/header.component';
import { TopComponent } from './top/top.component';
import { BrandsComponent } from './brands/brands.component';
import { ItemsComponent } from './items/items.component';
import { DataListComponent } from './data-list/data-list.component';
import { RegisterComponent } from './register/register.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartsModule } from "ng2-charts";
import { SearchComponent } from './search/search.component';
import { DrawGraphComponent } from './draw-graph/draw-graph.component';
import { EscapePipe } from './pipe/escape.pipe';
import { DrawDetailGraphComponent } from './draw-detail-graph/draw-detail-graph.component';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { environment } from "../environments/environment";
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { NoDataComponent } from './no-data/no-data.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TopComponent,
    BrandsComponent,
    ItemsComponent,
    DataListComponent,
    RegisterComponent,
    SearchComponent,
    DrawGraphComponent,
    EscapePipe,
    DrawDetailGraphComponent,
    SignUpComponent,
    SignInComponent,
    NotFoundComponent,
    NoDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatExpansionModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    FlexLayoutModule,
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
