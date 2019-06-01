import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import firebase, { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  private db = firebase.firestore();
  private currentUser: User;

  constructor(public http: HttpClient, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(data => {
      if (data) {
        this.db
          .collection("users")
          .doc(data.uid)
          .onSnapshot((querySnapshot:any) => {
            this.currentUser = querySnapshot.data();
          });
      }
    });
  }

  // Returns current user UID
  get currentUserProfile(): User {
    return this.currentUser ? this.currentUser : null;
  }


}
