
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { PostAddPage } from '../pages/post-add/post-add';
import { PostsPage } from '../pages/posts/posts';
import { AdminPostsPage } from '../pages/admin-posts/admin-posts';
import { AdminUsersPage } from '../pages/admin-users/admin-users';
import { ProfilePage } from '../pages/profile/profile';
import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';
import { SearchPage } from '../pages/search/search';
import { PostDetailsPage } from '../pages/post-details/post-details';

export const ROUTES = [
  { component: HomePage, name: 'home', segment: '' },

  // Auth
  { component: LoginPage, name: 'login', segment: 'auth/login', defaultHistory: [HomePage] },
  { component: RegisterPage, name: 'register', segment: 'auth/register', defaultHistory: [HomePage] },

  // Profile
  { component: ProfilePage, name: 'profile', segment: 'profile/:id' },
  { component: ProfileSettingsPage, name: 'profile-settings', segment: 'profile-settings', defaultHistory: [ProfilePage] },

  // Search
  { component: SearchPage, name: 'search', segment: 'search' },

  // Post
  { component: PostAddPage, name: 'add-post', segment: 'post/add', defaultHistory: [HomePage] },
  { component: PostsPage, name: 'post', segment: 'posts/:type/:id', defaultHistory: [HomePage] },
  { component: PostDetailsPage, name: 'post-details', segment: 'post/:id/:title'},

  // Admin
  { component: AdminPostsPage, name: 'admin-posts', segment: 'admin/posts'},
  { component: AdminUsersPage, name: 'admin-users', segment: 'admin/users'},

];
