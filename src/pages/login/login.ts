import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from "@ionic/storage";
import firebase from "firebase";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  db = firebase.firestore();
  loginForm: FormGroup;
  loginFormButtonDisabled: boolean;
  resendVerification: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public authService: AuthProvider,
    public toast: ToastProvider,
    public storage: Storage) {
      this.loginForm = new FormGroup({
        'email': new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        'password': new FormControl('', [
          Validators.required,
          Validators.minLength(6)
        ])
      });
  }

  ionViewWillEnter() {
    this.afAuth.authState.subscribe((data)=> {
      if(data && data.emailVerified) {
        this.navCtrl.setRoot('home');
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    if (this.loginForm.invalid) return false;
    this.loginFormButtonDisabled = true;
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).then(data=> {
      console.log(data.user.uid);
      if(data.user.uid) {
        if(!data.user.emailVerified) {
          this.loginFormButtonDisabled = false;
          this.toast.show("Your email is not verified yet!", 'middle');
          this.resendVerification = true;
        } else {
          localStorage.setItem("loginData",data.user.uid)
          this.navCtrl.setRoot('home');
        }
      }
    }).catch(error=> {
      this.toast.show(error.message, 'bottom');
      this.loginFormButtonDisabled = false;
    })
  }

  resendVerificationMail() {
    this.afAuth.auth.currentUser.sendEmailVerification().then(()=> {
      this.toast.show('Verification email has been sent!', 'bottom');
      this.resendVerification = false;
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
