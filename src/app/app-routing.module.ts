import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopComponent } from './top/top.component';
import { BrandsComponent } from './brands/brands.component';
import { ItemsComponent } from './items/items.component';
import { DataListComponent } from './data-list/data-list.component';
import { BrandDetailComponent } from './brand-detail/brand-detail.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/top', pathMatch: 'full' },
  { path: 'top', component: TopComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'brands/:name', component: BrandDetailComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'items/:category', component: ItemDetailComponent },
  { path: 'data-list', component: DataListComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
