import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';

/*
  Generated class for the NavigationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NavigationProvider {

  constructor(public http: HttpClient, private appCtrl: App) {
    console.log('Hello NavigationProvider Provider');
  }

  gotoPage(pageName: string, params = {}) {
    this.appCtrl.getRootNav().push(pageName, params);
  }
}
