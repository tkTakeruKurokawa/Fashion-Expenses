import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export class Session {
  login: boolean;
  uid: string;

  constructor() {
    this.login = false;
    this.uid = "";
  }

  reset(): Session {
    this.login = false;
    this.uid = "";
    return this;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public session = new Session();
  public session_subject = new Subject<Session>();
  public session_state = this.session_subject.asObservable();

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private store: AngularFirestore,
  ) { }


  sign_up(email: string, password: string) {
    this.auth
      .auth
      .createUserWithEmailAndPassword(email, password)
      // .then(_auth => {
      //   return this.create_user(_auth.user.uid);
      //   return auth.user.sendEmailVerification();
      // })
      // .then(() => {
      //   return this.create_user(auth.user.uid);
      // })
      .then(() => {
        return this.router.navigate(['/sign-in']);
      })
      // .then(() => alert('${email}宛にメールアドレス確認メールを送信しました'))
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
      // .then(auth => {
      //   if (!auth.user.emailVerified) {
      //     this.auth.auth.signOut();
      //     alert('メールアドレスが確認できていません');
      //   } else {
      //     this.login = true;
      //     this.uid = auth.user.uid;
      //     return this.router.navigate(['/top']);
      //   }
      // })
      .then(auth => {
        // this.uid = auth.user.uid;
        // console.log(this.store.collection('users').doc(this.uid).valueChanges());
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
        this.session.login = (!!auth);
        // this.session.uid = auth.uid;
        this.session_subject.next(this.session);
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

  check_login(): boolean {
    return this.session.login
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

  create_user(uid: string) {
    return this.store
      .collection('users/')
      .doc(uid)
      .set(Object.assign({}, uid));
  }
}
