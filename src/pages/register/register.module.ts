import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    IonicPageModule.forChild(RegisterPage),
  ]
})
export class RegisterPageModule {}
