import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the AdminPostsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-posts',
  templateUrl: 'admin-posts.html',
})
export class AdminPostsPage {
  db = firebase.firestore();
  posts: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPostsPage');
    this.db.collection("posts").orderBy("adminApproved").onSnapshot(querySnapshot=> {
      this.posts = [];
      querySnapshot.forEach((doc) => {
        let post = doc.data();
        post["id"] = doc.id;
        this.posts.push(post);
      });
    });
  }

  approvePost(post) {
    this.db.collection("posts").doc(post.id).update({
      adminApproved: true
    });
  }

}
