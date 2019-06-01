import { Component, ViewChild } from '@angular/core';
import { Platform, Content, MenuController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from "firebase";
import { AdminPostsPage } from '../pages/admin-posts/admin-posts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Content) content: Content;
  db = firebase.firestore();
  root:any = HomePage;
  user: any;

  constructor(platform: Platform, private afAuth: AngularFireAuth, public menuCtrl: MenuController) {
    this.afAuth.authState.subscribe((data)=> {
      if(data && data.emailVerified) {
        this.db.collection('users').where('uid', '==', data.uid).onSnapshot(querySnapshot=> {
          querySnapshot.forEach((doc) => {
            this.user = doc.data();
            this.content.resize();
            if(this.user.role === "ADMIN") {
              this.root = AdminPostsPage;
            }
          });
        });
      } else {
        this.user = null;
        this.root = HomePage;
        this.content.resize();
      }
    });
  }

}

