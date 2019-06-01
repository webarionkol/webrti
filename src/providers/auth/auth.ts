import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase";

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  authUser: firebase.User;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(data => {
      this.authUser = data;
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authUser !== null;
  }
  // Returns current user UID
  get currentUserUID(): string {
    return this.authenticated ? this.authUser.uid : null;
  }

}
