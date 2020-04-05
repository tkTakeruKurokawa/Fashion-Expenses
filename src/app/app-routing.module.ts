import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopComponent } from './top/top.component';
import { BrandsComponent } from './brands/brands.component';
import { ItemsComponent } from './items/items.component';
import { DataListComponent } from './data-list/data-list.component';
import { DrawDetailGraphComponent } from './draw-detail-graph/draw-detail-graph.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';


const routes: Routes = [
  { path: '', redirectTo: '/top', pathMatch: 'full' },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'top', component: TopComponent },
  { path: 'brands', component: BrandsComponent },
  { path: 'brands/:name', component: DrawDetailGraphComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'items/:category', component: DrawDetailGraphComponent },
  { path: 'data-list', component: DataListComponent },
  { path: '**', redirectTo: '/top' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
