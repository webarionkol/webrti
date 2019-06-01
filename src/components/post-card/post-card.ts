import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PostProvider } from '../../providers/post/post';
import { Post } from '../../interfaces/post.interface';
import { AuthProvider } from '../../providers/auth/auth';
import { ToastProvider } from '../../providers/toast/toast';
import moment from 'moment';
import { NavigationProvider } from '../../providers/navigation/navigation';
/**
 * Generated class for the PostCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */


 interface CardConfig {
  headingFontSize: string;
 }

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.html'
})
export class PostCardComponent implements OnInit, OnChanges {

  @Input() post: Post;
  @Input() hideContent?: boolean;
  @Input() hideHeading?: boolean;
  @Input() hideImage?: boolean;
  @Input() hideFooter?: boolean;
  @Input() config?: CardConfig;

  public moment = moment;
  public likes: string[];
  public comments: string[];
  public postLikedByCurrentUser: boolean;
  public navParams: {id: string, title: string};

  constructor(
    public postProvider: PostProvider,
    public authProvider: AuthProvider,
    public toast: ToastProvider,
    public nav: NavigationProvider
    ) {

  }

  ngOnInit() {
    this.post.displayImage = this.postProvider.encodeURL(this.post.featureImage);
    this.likes = this.post.likes ? Object.keys(this.post.likes) : [];
    this.comments = this.post.comments ? Object.keys(this.post.comments) : [];
    this.postLikedByCurrentUser = this.likes.indexOf(this.authProvider.currentUserUID) != -1 ? true : false;
    this.navParams = {
      id: this.post.id,
      title: this.post.title.replace(/^[, ]+|[, ]+$|[, ]+/g, " ").trim().replace(/ /g,"-").toLowerCase()
    };
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  likePost() {
    if(!this.authProvider.authenticated) {
      this.toast.show('You are not logged in! Please login', 'bottom');
    } else if(!this.postLikedByCurrentUser) {
      this.postProvider.likePost(this.post).then(()=> {
        this.toast.show('Thanks for your inspiration!', 'bottom');
      });
    } else {
      this.toast.show('You have already liked this post!', 'top');
    }
  }

}
