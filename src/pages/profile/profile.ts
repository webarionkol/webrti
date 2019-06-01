import { Component } from '@angular/core';
import { IonicPage, NavParams, App } from 'ionic-angular';
import { ToastProvider } from '../../providers/toast/toast';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { PostProvider } from '../../providers/post/post';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  placeholderPicture = "assets/imgs/avatar/user.png";
  db = firebase.firestore();
  storage = firebase.storage();
  following = false;
  user: any;
  posts: Array<any> = [];
  authCurrentUser: firebase.User;


  constructor(public appCtrl: App, public navParams: NavParams, public toast: ToastProvider, public afAuth: AngularFireAuth, public postProvider: PostProvider) {
    if(!this.navParams.get("id")) {
      this.appCtrl.getRootNav().push("home");
    } else {
      this.user = {
        displayName: '',
        email: '',
        photoURL: null,
        coverImage: null,
        occupation: 'Author',
        location: null,
        city: null,
        description: null,
        followers: 0,
        following: 0,
        posts: 0,
        uid: this.navParams.get("id")
      };

      this.getUser();
      this.getUserPost();

    }

  }

  ionViewDidLoad() {
    this.afAuth.auth.onAuthStateChanged((data)=> {
      this.authCurrentUser = data;
      console.log(this.authCurrentUser);
    });
    this.afAuth.authState.subscribe((data)=> {
      this.authCurrentUser = data;
      console.log(this.authCurrentUser);
    });
  }

  getUserFollowings(data): any {
    if(data.following && Object.keys(data.following).length) {
      this.user.following = Object.keys(data.following).length;
    }
  }

  getUserFollowers(data): any {
    // this.db.collection("users").where("authorId", '==', this.user.uid).where("adminApproved", '==', true).onSnapshot(querySnapshot=> {
    //   querySnapshot.forEach((doc) => {
    //     let post = doc.data();
    //     post["id"] = doc.id;
    //     if(!post.featureImage) return false;
    //     this.storage.ref(post.featureImage).getDownloadURL().then(imageURL=> {
    //       post["featureImage"] = imageURL;
    //       this.posts.push(post);
    //     });
    //   });
    // });
  }

  getUserPost(): any {
    this.db.collection("posts").where("authorId", '==', this.user.uid).where("adminApproved", '==', true).onSnapshot(querySnapshot=> {
      querySnapshot.forEach((doc) => {
        let post = doc.data();
        post["id"] = doc.id;
        if(!post.featureImage) return false;
        this.storage.ref(post.featureImage).getDownloadURL().then(imageURL=> {
          post["featureImage"] = imageURL;
          this.posts.push(post);
        });
      });
    });
  }

  getUser() {
    this.db.collection("users").doc(this.user.uid).onSnapshot(querySnapshot=> {
      if(querySnapshot) {
        let user = querySnapshot.data();
        this.user.displayName = user.displayName;
        this.user.email = user.email;
        this.user.gender = user.gender ? user.gender : null;
        this.user.city = user.city;
        this.user.description = user.description ? user.description : null;
        this.user.occupation = user.occupation ? user.occupation : null;
        this.user.photoURL = user.photoURL ? user.photoURL : null;
        this.user.coverImage = user.coverImage ? user.coverImage : null;
        this.getUserFollowings(user);
        this.getUserCity();
      }
    });
  }

  getUserCity() {
    firebase.database().ref('cities').orderByChild("id").equalTo(this.user.city).on("value", (snapshot)=> {
      let response = snapshot.val();
      let data = Object.keys(response)[0];
      this.user.location = response[data];
    });
  }

  follow() {
    let updateData = {};
        updateData[this.user.uid] = this.user.displayName;
    this.db.collection('users').doc(this.authCurrentUser.uid).set({
      following: updateData
    },{merge:true}).then(()=> {
    this.toast.show(`${this.user.displayName} is added in your follower list`);
    }).catch(console.error);
  }

  imageTapped(post) {
    this.toast.show('Post image clicked');
  }

  comment(post) {
    this.toast.show('Comments clicked');
  }

  like(post) {
    this.toast.show('Like clicked');
  }

  gotoPage(pageName: string, params = {}) {
    this.appCtrl.getRootNav().push(pageName, params);
  }

  verifyEmail():void {
    if(!this.authCurrentUser.emailVerified) {
      this.afAuth.auth.currentUser.sendEmailVerification().then(()=> {
        this.toast.show('Please verify your email before proceed!', 'bottom');
      });
    } else {
      this.toast.show('Email already verified', 'bottom');
    }
  }

}
