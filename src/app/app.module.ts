import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { MyApp } from './app.component';

import { LoginPageModule } from '../pages/login/login.module';

import { AuthProvider } from '../providers/auth/auth';
import { PostProvider } from '../providers/post/post';
import { HomePageModule } from '../pages/home/home.module';
import { ROUTES } from './app-routing.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { ToastProvider } from '../providers/toast/toast';
import { PostAddPageModule } from '../pages/post-add/post-add.module';
import { ComponentsModule } from '../components/components.module';
import { PostsPageModule } from '../pages/posts/posts.module';
import { AdminUsersPageModule } from '../pages/admin-users/admin-users.module';
import { AdminPostsPageModule } from '../pages/admin-posts/admin-posts.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { ProfileSettingsPageModule } from '../pages/profile-settings/profile-settings.module';
import { SearchPageModule } from '../pages/search/search.module';
import { UserProvider } from '../providers/user/user';
import { PostDetailsPageModule } from '../pages/post-details/post-details.module';
import { NavigationProvider } from '../providers/navigation/navigation';
import { CallPageModule } from '../pages/call/call.module';
import { TermsandcondectionPageModule } from '../pages/termsandcondection/termsandcondection.module';
import { PrivicyPageModule } from '../pages/privicy/privicy.module';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {}, {
      links: ROUTES
    }),
    HomePageModule,
    ComponentsModule,
    LoginPageModule,
    TermsandcondectionPageModule,
    RegisterPageModule,
    ProfilePageModule,
    ProfileSettingsPageModule,
    PostAddPageModule,
    PrivicyPageModule,
    PostsPageModule,
    AdminUsersPageModule,
    AdminPostsPageModule,
    SearchPageModule,
    PostDetailsPageModule,
    CallPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthProvider,
    UserProvider,
    PostProvider,
    SocialSharing,
    ToastProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NavigationProvider,
  ]
})
export class AppModule {}
