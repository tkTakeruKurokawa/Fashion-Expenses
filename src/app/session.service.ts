import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public login: boolean = false;
  public uid: string = "";

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private store: AngularFirestore
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
        this.login = true;
        this.uid = auth.user.uid;
        console.log(this.store.collection('users').doc(this.uid).valueChanges());
        return this.router.navigate(['/top']);
      }
      )
      .then(() => alert('ログインしました'))
      .catch(err => {
        console.log(err);
        alert('ログインに失敗しました。\n' + err);
      })
  }

  sign_out() {
    this.auth
      .auth
      .signOut()
      .then(() => {
        this.login = false;
        this.uid = "";
        return this.router.navigate(['/sign_in']);
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
