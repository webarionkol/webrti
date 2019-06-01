import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../../interfaces/post.interface';
import firebase from 'firebase';
import { AuthProvider } from '../auth/auth';
import { UserProvider } from '../user/user';

/*
  Generated class for the PostProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostProvider {
  db = firebase.firestore().collection('posts');
  fireStorageURL = "https://firebasestorage.googleapis.com/v0/b/webrti.appspot.com/o/";

  constructor(public http: HttpClient, private authProvider: AuthProvider, private userProvider: UserProvider) {
    // console.log('Hello PostProvider Provider');
  }

  encodeURL(url: any): string {
    return `${this.fireStorageURL}${encodeURIComponent(url)}?alt=media`;
  }

  async likePost(post: Post) {

    let updateData = {};
        updateData[this.authProvider.currentUserUID] = this.userProvider.currentUserProfile.displayName;
    return this.db.doc(post.id).set({
      likes: updateData
    }, {
      merge:true
    });
  }
  // async comment(post: Post) {
  //   let updateData = {};
  //       updateData[this.authProvider.currentUserUID] = this.userProvider.currentUserProfile.displayName;
  //   return this.db.doc(post.id).set({
  //     comments: updateData
  //   }, {
  //     merge:true
  //   });
  // }

  async getPost(id: string) {
    return await this.db.doc(id).get();
  }


}
