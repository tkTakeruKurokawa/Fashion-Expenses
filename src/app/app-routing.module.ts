import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopComponent } from './top/top.component';
import { BrandsComponent } from './brands/brands.component';
import { ItemsComponent } from './items/items.component';
import { DataListComponent } from './data-list/data-list.component';
import { DrawDetailGraphComponent } from './draw-detail-graph/draw-detail-graph.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { FormComponent } from './form/form.component';


const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent, canActivate: [LoginGuard] },
  { path: 'sign-in', component: SignInComponent, canActivate: [LoginGuard] },
  { path: '', component: TopComponent, canActivate: [AuthGuard] },
  { path: 'brands', component: BrandsComponent, canActivate: [AuthGuard] },
  { path: 'brands/:name', component: DrawDetailGraphComponent, canActivate: [AuthGuard] },
  { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
  { path: 'items/:category', component: DrawDetailGraphComponent, canActivate: [AuthGuard] },
  { path: 'data-list', component: DataListComponent, canActivate: [AuthGuard] },
  { path: 'registration', component: FormComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
