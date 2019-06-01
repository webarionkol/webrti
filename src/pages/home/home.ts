import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import firebase from 'firebase';
import { Post } from '../../interfaces/post.interface';

import { SocialSharing } from '@ionic-native/social-sharing';
import { CallPage } from '../call/call';
import { TermsandcondectionPage } from '../termsandcondection/termsandcondection';
import { PrivicyPage } from '../privicy/privicy';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  db = firebase.firestore();
  storage = firebase.storage();
  posts: Array<Post> = [];

  constructor(private socialSharing: SocialSharing,public plat:Platform,public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.getAllPost();
  }


  getAllPost(): any {
    this.db.collection("posts").where('adminApproved', '==', true).onSnapshot(querySnapshot=> {
      this.posts = [];
      querySnapshot.forEach((doc:any) => {
        console.log(doc)
        let post:Post = doc.data();
        post["id"] = doc.id;
        this.posts.push(post);
      });
    });
  }
  share(){
    this.plat.ready().then(() =>{
      this.socialSharing.share("Download our app from playstore", null , "https://webrti.firebaseapp.com/");
   });
  }
  tandc(){
   this.navCtrl.push(TermsandcondectionPage)
  }
  pricy(){
    this.navCtrl.push(PrivicyPage)
  }
  call(){
    this.navCtrl.push(CallPage)
  }
}
