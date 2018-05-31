import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  defaultUserImage = env.DEFAULT.userImagePlaceholder;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider  // Trigger constructor of userProvider
  ) {}

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
