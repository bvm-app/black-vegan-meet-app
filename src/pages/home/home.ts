import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { env } from '../../app/env';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  defaultUserImage = env.DEFAULT.userImagePlaceholder;

  constructor(public navCtrl: NavController) {

  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
