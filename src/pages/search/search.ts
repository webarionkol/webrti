import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  fireStorageURL = "https://firebasestorage.googleapis.com/v0/b/webrti.appspot.com/o/";
  db = firebase.firestore();
  users: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public appCtrl: App,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }
  encodeURL(url){
    return `${this.fireStorageURL}${encodeURIComponent(url)}?alt=media`;
  }
  onSearchInput(event) {
    console.log(event['srcElement'].value);
    if(!event['srcElement'].value) return false;
    const name: string = event['srcElement'].value;
    // .where('displayName', '>=', name)
    // .orderBy('displayName').startAt(name.toUpperCase()).endAt(name.toLowerCase()+"\uf8ff")
    this.db.collection("users").orderBy('displayName').where('displayName', '>=', name.toUpperCase()+"\uf8ff").onSnapshot(querySnapshot=> {
      this.users = [];
      querySnapshot.forEach((doc) => {
        let user = doc.data();
        this.users.push(user);
      });
    });


  }

  gotoPage(pageName: string, params = {}) {
    this.appCtrl.getRootNav().push(pageName, params);
  }


}
