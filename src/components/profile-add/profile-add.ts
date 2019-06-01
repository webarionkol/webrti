import { Component } from '@angular/core';

/**
 * Generated class for the ProfileAddComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'profile-add',
  templateUrl: 'profile-add.html'
})
export class ProfileAddComponent {

  text: string;

  constructor() {
    // console.log('Hello ProfileAddComponent Component');
    this.text = 'Hello World';
  }

}
