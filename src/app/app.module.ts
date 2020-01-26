import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { HeaderComponent } from './header/header.component';
import { TopComponent } from './top/top.component';
import { BrandsComponent } from './brands/brands.component';
import { ItemsComponent } from './items/items.component';
import { DataListComponent } from './data-list/data-list.component';
import { RegisterComponent } from './register/register.component';
import { BrandDetailComponent } from './brand-detail/brand-detail.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TopComponent,
    BrandsComponent,
    ItemsComponent,
    DataListComponent,
    RegisterComponent,
    BrandDetailComponent,
    ItemDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
