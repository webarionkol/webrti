import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the AdminUsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-users',
  templateUrl: 'admin-users.html',
})
export class AdminUsersPage {

  db = firebase.firestore();

  users: any[];
  cities: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    firebase.database().ref('cities').once('value').then((snapshot)=> {
      this.cities = snapshot.val();
    });
    this.db.collection("users").onSnapshot(querySnapshot=> {
      this.users = [];
      querySnapshot.forEach((doc) => {
        let user = doc.data();
        user["id"] = doc.id;
        this.users.push(user);
      });
    });
  }

  getCityName(code) {
    if(this.cities.length) {
      let city = this.cities.find(i => i.id == code);
      return city.name;
    } else {
      return "";
    }
  }


}
