import { Component } from '@angular/core';
import { IonicPage, NavParams, ToastController } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { Post } from '../../interfaces/post.interface';
import { AuthProvider } from '../../providers/auth/auth';
import moment from 'moment';
import { ToastProvider } from '../../providers/toast/toast';
import firebase from "firebase";
/**
 * Generated class for the PostDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post-details',
  templateUrl: 'post-details.html',
})
export class PostDetailsPage {
  placeholderPicture = "assets/imgs/avatar/user.png";
  db = firebase.firestore();
  storage = firebase.storage();
  following = false;
  user: any;
  posts: Array<any> = [];
  authCurrentUser: firebase.User;


  post: Post;
  public moment = moment;
  public likes: string[];
  public comments: string[];
  public postLikedByCurrentUser: boolean;
  inputText : any;
  commentarre: any=[]
  constructor(
    private navParams: NavParams,
    private postProvider: PostProvider,
    public authProvider: AuthProvider,
    public toastCtrl :ToastController,
    public toast: ToastProvider,
    ) {
  }

  ionViewDidLoad() {
    this.commentarre=[];
    firebase.database().ref('Comment').child(this.navParams.get('id')).once('value',data=>{
      console.log(data)
      data.forEach(da=>{
        
        this.commentarre.push({
          "id":da.key,
          "name":da.val().Name,
          "comment":da.val().Comment

        })

        return false;
      })
      console.log(this.commentarre)
    })
    console.log(this.navParams.get('id'))
    if(!this.navParams.get('id')) return;
    this.postProvider.getPost(this.navParams.get('id')).then((snapshot: any)=> {
      this.post = snapshot.data();
    }).then(()=> {
      this.post.displayImage = this.postProvider.encodeURL(this.post.featureImage);
      this.likes = this.post.likes ? Object.keys(this.post.likes) : [];
      this.comments = this.post.comments ? Object.keys(this.post.comments) : [];
      this.postLikedByCurrentUser = this.likes.indexOf(this.authProvider.currentUserUID) != -1 ? true:false;
    });
  }


  likePost() {
    if(!this.postLikedByCurrentUser) {
      this.postProvider.likePost(this.post).then(()=> {
        this.toast.show('Thanks for your inspiration!', 'bottom');
      });
    } else {
      this.toast.show('You have already liked this post!', 'top');
    }
  }
  click(){
    console.log(this.post)
 
      
    this.getUser();
  }

  getUser() {
    console.log(localStorage.getItem('loginData'))
    if(localStorage.getItem('loginData')){
      this.db.collection("users").doc(localStorage.getItem('loginData')).onSnapshot(querySnapshot=> {
        if(querySnapshot) {
          let user = querySnapshot.data();
  
  
          firebase.database().ref('Comment').child(this.navParams.get('id')).push().set({
            Comment:this.inputText,
            Name: user.displayName,
            postid:this.navParams.get('id'),
            
           
      
  
  
     }).then(data=>{
      const toast = this.toastCtrl.create({
        message: 'Comment added successfully',
  
        duration: 3000
      });
      toast.present();
      this.inputText="";
      this.ionViewDidLoad();
     })
  
          console.log(user)
        }
      });
    }
    else{
      const toast = this.toastCtrl.create({
        message: 'No login found',
  
        duration: 3000
      });
      toast.present();
    }
  
   
  }
}
