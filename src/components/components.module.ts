import { NgModule } from '@angular/core';
import { HeaderComponent, UserHeaderPopover, ChangeCityModal } from './header/header';
import { FooterComponent } from './footer/footer';
import { IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AuthProvider } from '../providers/auth/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { PostCardComponent } from './post-card/post-card';
import { ProfileAddComponent } from './profile-add/profile-add';

@NgModule({
	declarations: [
    HeaderComponent,
    FooterComponent,
    UserHeaderPopover,
    ChangeCityModal,
    PostCardComponent,
    ProfileAddComponent
  ],
  entryComponents: [ HeaderComponent, UserHeaderPopover, ChangeCityModal, PostCardComponent ],
	imports: [IonicModule, IonicStorageModule],
	exports: [
    HeaderComponent,
    FooterComponent,
    UserHeaderPopover,
    ChangeCityModal,
    PostCardComponent,
    ProfileAddComponent
  ],
  providers: [
    AuthProvider,
    AngularFireAuth
  ]
})
export class ComponentsModule {}
