import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../service/session.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private session_service: SessionService,
    private router: Router,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.session_service
      .check_sign_in_state()
      .pipe(
        map(session => {
          if (session.login) {
            this.router.navigate(['']);
            alert('ログイン中はログインページ，アカウント登録ページにはアクセスできません');
          }

          return !session.login;
        })
      );
  }
}
