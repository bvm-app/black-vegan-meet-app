import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';
import * as firebase from 'firebase';
import { env } from '../../app/env';
import { IUser } from '../../models/IUser';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  defaultUserImagePlaceholder = env.DEFAULT.userImagePlaceholder;
  user: IUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public userProvider: UserProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.user = this.userProvider.getCurrentUser();
  }

  logout() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Logout',
      message: 'Do you sign out of the application?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          handler: () => {
            this.toastCtrl.create({
              message: 'You have logged out successfully.',
              duration: 3000
            }).present();

            // Remove all provider subscriptions
            this.userProvider.unsubscribeSubscriptions();

            firebase.auth().signOut();
          }
        }
      ]
    });
    alert.present();
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
