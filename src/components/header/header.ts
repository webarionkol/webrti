import { Component, OnInit } from '@angular/core';
import { PopoverController, ViewController, App, ModalController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from "@ionic/storage";
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: '[app-header]',
  templateUrl: 'header.html'
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean = false;
  db = firebase.firestore();
  user: any;

  constructor(
    public authService: AuthProvider,
    public afAuth: AngularFireAuth,
    public popoverCtrl: PopoverController,
    public storage: Storage,
    public appCtrl: App,
    ) {
      this.afAuth.auth.onAuthStateChanged((data)=> {
        this.getUserData(data);
      });
      this.afAuth.authState.subscribe((data)=> {
        this.getUserData(data);
      });
  }

  private getUserData(data: firebase.User) {
    if (data && data.emailVerified) {
      this.db.collection('users').where('uid', '==', data.uid).onSnapshot(querySnapshot => {
        querySnapshot.forEach((doc) => {
          this.user = doc.data();
          this.loggedIn = this.user ? true : false;
        });
      });
    }
    else {
      this.loggedIn = false;
      this.user = null;
    }
  }

  ngOnInit(): void {

  }

  gotoPage(pageName: string, params = {}) {
    this.appCtrl.getRootNav().push(pageName, params);
  }

  userPopover($event): void {
     this.popoverCtrl.create(UserHeaderPopover, this.user, {
       showBackdrop: true,
       enableBackdropDismiss: true,
       cssClass: 'header-menu'
     }).present({
       direction: '',
       ev: $event
     });
  }

  gotoPostPage(type: 'MY'|'FOLLOWER'|'CITY') {
    if(!type) return false;
    switch (type) {
      case "MY":
        this.gotoPage("post", {
          type: "user",
          id: this.user.uid
        });
        break;
      case "FOLLOWER":
        this.gotoPage("post", {
          type: "follower",
          id: this.user.uid
        });
        break;
      case "CITY":
        this.gotoPage("post", {
          type: "city",
          id: this.user.city
        });
        break;
      default:
        break;
    }
  }



}


@Component({
  template: `
    <ion-list>
      <ion-list-header>settings</ion-list-header>
      <button ion-item [disabled]="!user || !user.uid" (click)="gotoPage('profile', {id: user.uid})" *ngIf="navParams.data?.role !== 'ADMIN'">My Profile</button>
      <button ion-item [disabled]="!user" (click)="openChangeCityModal()" *ngIf="navParams.data?.role !== 'ADMIN'">Change City</button>
      <button ion-item (click)="logout()">Logout</button>
    </ion-list>
  `
})
export class UserHeaderPopover implements OnInit {

  user: any;

  constructor(
    public viewCtrl: ViewController,
    public afAuth: AngularFireAuth,
    public appCtrl: App,
    public modalCtrl: ModalController,
    public storage: Storage,
    public navParams: NavParams
    ) {
      this.user = this.navParams.data;
    }

  ngOnInit(): void {

  }

  gotoPage(pageName: string, params = {}) {
    this.close().then(()=> {
      this.appCtrl.getRootNav().push(pageName, params);
    });
  }

  openChangeCityModal() {
    this.close().then(()=> {
      const modal = this.modalCtrl.create(ChangeCityModal, {}, {
        enableBackdropDismiss: true,
        showBackdrop: true
      });
      modal.present();
    });
  }

  async close() {
    await this.viewCtrl.dismiss();
  }

  logout() {
    this.storage.clear();
    this.afAuth.auth.signOut().then(()=> {
      localStorage.clear();
      this.gotoPage("login");
    });
  }

}




@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <button ion-button icon-only (click)="closeModal()">
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list radio-group >
        <ion-list-header>
          Cities
        </ion-list-header>
        <ion-item *ngFor="let city of cities">
          <ion-label>{{city.name}}</ion-label>
          <ion-radio name="city" value="{{city.id}}" [checked]="user?.city == city.id" (ionSelect)="changeCity($event)"></ion-radio>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class ChangeCityModal implements OnInit {

  cities: any[];
  db = firebase.firestore();
  user: any;

  constructor(public afAuth: AngularFireAuth,public viewCtrl: ViewController,) {
    this.db.collection('users').doc(this.afAuth.auth.currentUser.uid).get().then(snapshot => {
      console.log(snapshot.data());
      this.user = snapshot.data();
    });
  }

  ngOnInit(): void {
    firebase.database().ref('cities').once('value').then((snapshot)=> {
      this.cities = snapshot.val();
    });
  }

  changeCity(event) {
    this.db.collection('users').doc(this.afAuth.auth.currentUser.uid).update({
      city: event
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
