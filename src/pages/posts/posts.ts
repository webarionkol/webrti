import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

/**
 * Generated class for the PostsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
})
export class PostsPage {

  db = firebase.firestore();
  storage = firebase.storage();
  postType: any;
  postTypeId: any;
  posts: Array<any> = [];
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,) {
    this.postType = this.navParams.get("type");
    this.postTypeId = this.navParams.get("id");
  }

  ionViewDidLoad() {
    console.log("PostsPage loaded");

    this.afAuth.authState.subscribe((data)=> {
      if(data && data.emailVerified) {
        this.db.collection('users').where('uid', '==', data.uid).onSnapshot(querySnapshot=> {
          querySnapshot.forEach((doc) => {
            this.user = doc.data();
            this.searchPost();
          });
        });
      }
    });
  }

  searchPost(): any {
    if(this.getKeyName() === 'follower') {
      if(!this.user.following) return false;
      const followingIDs = Object.keys(this.user.following);
      let query:any = this.db.collection("posts");
          query = query.where('adminApproved', '==', true);
      followingIDs.forEach((followingID, index) => {
        query = query.where('authorId', '==', followingID);
        if((index+1)== followingIDs.length) {
          query.get().then((querySnapshot)=> {
            this.setPostData(querySnapshot);
          });
        }
      });
    } else {
      let query:any = this.db.collection("posts");
          query = query.where(this.getKeyName(), '==', this.postTypeId);
          if(this.user.uid !== this.postTypeId) {
            query = query.where('adminApproved', '==', true)
          }
          query.get().then((querySnapshot)=> {
            this.setPostData(querySnapshot);
          });
    }
  }

  private setPostData(querySnapshot: firebase.firestore.QuerySnapshot) {
    this.posts = [];
    querySnapshot.forEach((doc) => {
      let post = doc.data();
      post["id"] = doc.id;
      this.posts.push(post);
    });
  }

  getKeyName(): string | firebase.firestore.FieldPath {
    let keyName = null;
    switch (this.postType) {
      case "user":
        keyName = "authorId";
        break;
      case "city":
        keyName = "city";
        break;
      case "follower":
        keyName = "follower";
        break;
      default:
        break;
    }
    return keyName;
  }

  getImagePath(path) {

  }
}
