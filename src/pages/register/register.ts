import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import firebase from "firebase";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  db = firebase.firestore();
  registerForm: FormGroup;
  cities: { id: string; name: string; state: string; }[] = [];
  registerFormButtonDisabled: boolean;
  authSuccess: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public toast: ToastProvider,
    public appCtrl: App
  ) {
    this.registerForm = new FormGroup({
      'name': new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      'email': new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      'city': new FormControl('', [
        Validators.required
      ])
    });
  }

  ionViewDidLoad() {
    firebase.database().ref('cities').once('value').then((snapshot)=> {
      this.cities = snapshot.val();
    });
  }

  public register() {
    if(this.registerForm.valid) {
      this.registerFormButtonDisabled = true;
      this.afAuth.auth.createUserWithEmailAndPassword(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value).then(data=> {
        if(data.user) {
          this.toast.show('Registration successfull!', 'bottom');
          this.authSuccess = true;
          const user = {
            uid: data.user.uid,
            displayName: this.registerForm.controls['name'].value,
            email: data.user.email,
            photoURL: data.user.photoURL,
            role: 'USER',
            city: this.registerForm.controls['city'].value,
            createdAt: new Date().getTime(),
            createdBy: data.user.email
          };
          this.db.collection('users').doc(data.user.uid).set(user).then(()=> {
            if(!data.user.emailVerified) {
              this.afAuth.auth.currentUser.sendEmailVerification().then(()=> {
                this.toast.show('Please verify your email before proceed!', 'bottom');
                this.afAuth.auth.signOut();
                // this.storage.clear();
                // this.afAuth.auth.signOut().then(()=> {
                //   this.appCtrl.getRootNav().push("login");
                // });
              });
            }
          }, error => {
            console.error(error);
            this.toast.show(error.message, 'bottom');
          });
        }
      }, (error)=> {
        console.error(error);
        this.toast.show(error.message, 'bottom');
        this.registerFormButtonDisabled = false;
      });
    }
  }

}
