import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from "../class-interface/Session";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public session = new Session();
  public session_subject = new BehaviorSubject<Session>(null);
  public session_state = this.session_subject.asObservable();

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
  ) { }


  sign_up(email: string, password: string) {
    this.auth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(auth => {
        this.session.login = true;
        this.session.uid = auth.user.uid;
        this.session_subject.next(this.session);
        return this.router.navigate(['/']);
      })
      .then(() => alert(email + ' でアカウントを作成しました。'))
      .catch(err => {
        console.log(err);
        alert('アカウントの作成に失敗しました。\n' + err)
      })
  }

  sign_in(email: string, password: string) {
    this.auth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(auth => {
        this.session.login = true;
        this.session.uid = auth.user.uid;
        this.session_subject.next(this.session);
        return this.router.navigate(['/']);
      }
      )
      .then(() => alert('ログインしました'))
      .catch(err => {
        console.log(err);
        alert('ログインに失敗しました。\n' + err);
      })
  }

  check_sign_in() {
    this.auth
      .authState
      .subscribe(auth => {
        if (!!auth) {
          this.session.login = true;
          this.session.uid = auth.uid;
          this.session_subject.next(this.session);
        }
      });
  }

  check_sign_in_state(): Observable<Session> {
    return this.auth
      .authState
      .pipe(
        map(auth => {
          this.session.login = (!!auth);
          // this.session.uid = auth.uid;
          return this.session;
        })
      )
  }

  sign_out() {
    this.auth
      .auth
      .signOut()
      .then(() => {
        this.session_subject.next(this.session.reset());
        return this.router.navigate(['/sign-in']);
      })
      .then(() => alert('ログアウトしました'))
      .catch(err => {
        console.log(err);
        alert('ログアウトに失敗しました。\n' + err);
      })
  }
}
