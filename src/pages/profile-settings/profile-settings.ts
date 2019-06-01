import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl } from '@angular/forms';
import firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { PostProvider } from '../../providers/post/post';

@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})

export class ProfileSettingsPage {


  private db = firebase.firestore();
  storage = firebase.storage();
  placeholderPicture = "assets/imgs/avatar/user.png";
  genders: Array<string> = ["MALE", "FEMALE"];
  user:any;
  profileImageUploadPercentage: number;
  profileImageFullPath: string;
  profileImageTypeTransfered: number;
  profileImageTotalType: number;
  profileForm: FormGroup = new FormGroup({
    'gender': new FormControl(),
    'occupation': new FormControl(),
    'description': new FormControl()
  });

  constructor(
    public navParams: NavParams,
    private nav: NavController,
    public afAuth: AngularFireAuth,
    private angularFireStorage: AngularFireStorage,
    public loading: LoadingController,
    public postProvider: PostProvider
  ) {
    this.user = this.navParams.get("user");

    if(!this.user) {
      this.nav.setRoot("home");
    } else {
      this.profileForm.controls["gender"].setValue(this.user.gender ? this.user.gender : "");
      this.profileForm.controls["occupation"].setValue(this.user.occupation ? this.user.occupation : "");
      this.profileForm.controls["description"].setValue(this.user.description ? this.user.description : "");
    }
  }

  clickInputImage(id) {
    const input = document.getElementById(id);
    input.click();
  }

  updateImage(event, type) {
    const file = event.target.files.length ? event.target.files[0] : null;
    if(file && type) {
      this.uploadImage(file, type);
    }
  }

  uploadImage(file: any, type: string): any {

    const uploader = this.angularFireStorage.upload(`${type}/${this.user.uid}/${file.name.replace(/\s+/g, '-')}`, file, {
      contentType: file.type
    });
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    uploader.percentageChanges().subscribe(percentageChanges=> {
      this.profileImageUploadPercentage = percentageChanges;
    });
    uploader.then((completeUpload)=> {
      console.log("upload completed", completeUpload);

      if(type === 'avatar') {
        this.user.photoURL = completeUpload.metadata.fullPath;
      } else if(type === 'cover') {
        this.user.coverImage = completeUpload.metadata.fullPath;
      } else {
        return;
      }
      loader.dismiss().then(()=> {
        this.saveProfile();
      });
    });
    uploader.snapshotChanges().subscribe(snapshotChanges=> {
      this.profileImageTypeTransfered = snapshotChanges.bytesTransferred;
      this.profileImageTotalType = snapshotChanges.totalBytes;
    });
    uploader.catch((err)=> {
      console.error(err);
      loader.dismiss();
    });

  }

  saveProfile() {
    this.db.collection("users").doc(this.user.uid).update({
      gender: this.profileForm.controls["gender"].value,
      occupation: this.profileForm.controls["occupation"].value,
      description: this.profileForm.controls["description"].value,
      photoURL: this.user.photoURL,
      coverImage: this.user.coverImage
    }).then(()=> {
      console.log();
      this.profileImageFullPath = null;
    });
  }
}
