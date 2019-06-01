import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import { AngularFireStorage } from '@angular/fire/storage';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastProvider } from '../../providers/toast/toast';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { Post } from '../../interfaces/post.interface';
/**
 * Generated class for the PostAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-add',
  templateUrl: 'post-add.html',
})
export class PostAddPage {
  db = firebase.firestore();
  public Editor = ClassicEditor;
  postForm: FormGroup;
  postImageUploadPercentage: number;
  postImageTypeTransfered: number;
  postImageTotalType: number;
  postImageFullPath: string;
  user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private angularFireStorage: AngularFireStorage,
    public toast: ToastProvider,
    public afAuth: AngularFireAuth,
    public loading: LoadingController,
    public appCtrl: App,
  ) {
    this.postForm = new FormGroup({
      'title': new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      'content': new FormControl('', [
        Validators.required,
        Validators.minLength(200),
        Validators.maxLength(6000)
      ]),
    });
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe((data)=> {
      if(data) {
        this.db.collection('users').where('uid', '==', data.uid).onSnapshot((querySnapshot:any)=> {
          querySnapshot.forEach((doc: any) => {
            this.user = doc.data();
          });
        });
      }
    });
  }

  setFile(event) {
    const file = event.target.files.length ? event.target.files[0] : null;
    if(file) {
      this.uploadPostImage(file);
    }

  }
  uploadPostImage(file: any): any {
    if(this.postForm.controls['title'].invalid) return this.toast.show("Enter title first");
    const date = new Date();
    const todaysDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
    const uploader = this.angularFireStorage.upload(`post/${todaysDate}/${file.name.replace(/\s+/g, '-')}`, file, {
      contentType: file.type
    });
    let loader = this.loading.create({
      content: "Please wait..."
    });
    loader.present();
    uploader.percentageChanges().subscribe(percentageChanges=> {
      this.postImageUploadPercentage = percentageChanges;
    });
    uploader.then((completeUpload)=> {
      console.log("upload completed", completeUpload);
      this.postImageFullPath = completeUpload.metadata.fullPath;
      console.log(this.postImageFullPath)
      loader.dismiss();
    });
    uploader.snapshotChanges().subscribe(snapshotChanges=> {
      this.postImageTypeTransfered = snapshotChanges.bytesTransferred;
      this.postImageTotalType = snapshotChanges.totalBytes;
    });
    uploader.catch((err)=> {
      console.error(err.message);
      loader.dismiss();
    });
  }

  savePost(): void{
    if(this.postForm.valid && this.postImageFullPath) {
      const post: Post = {
        title: this.postForm.controls['title'].value,
        featureImage: this.postImageFullPath,
        content: this.postForm.controls['content'].value,
        city: this.user.city,
        authorId: this.afAuth.auth.currentUser.uid,
        authorEmail: this.afAuth.auth.currentUser.email,
        authorName: this.user.displayName,
        createdAt: new Date().getTime(),
        adminApproved: false,
        updatedAt: new Date().getTime(),
        comments: {},
        likes: {}
      };
      let loader = this.loading.create({
        content: "Please wait..."
      });
      loader.present();
      this.db.collection('posts').add(post).then((data)=> {
        this.appCtrl.getRootNav().push("post", {
          type: "user",
          id: this.afAuth.auth.currentUser.uid
        });
        
      }, error => {
        this.toast.show(error.message, 'bottom');
      }).then(()=> {
        loader.dismiss();
      });

    }else{
      this.toast.show('please upload image!');
      
    }
  }
}
