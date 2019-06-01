import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostAddPage } from './post-add';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [
    PostAddPage,
  ],
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CKEditorModule,
    AngularFireStorageModule,
    IonicPageModule.forChild(PostAddPage),
  ],
})
export class PostAddPageModule {}
