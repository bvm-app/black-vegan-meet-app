import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import moment from 'moment';
import firebase from 'firebase';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  defaultUserImagePlaceholder = env.DEFAULT.userImagePlaceholder;

  isCurrentLoggedInUser: boolean = true;;
  user: IUser;
  userSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public userProvider: UserProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    let userId = firebase.auth().currentUser.uid;
    if (this.navParams.data.userId) {
      userId = this.navParams.data.userId;
      this.isCurrentLoggedInUser = false;
    }

    this.userSubscription = this.db
      .object(`userData/${userId}`)
      .valueChanges()
      .subscribe((user: IUser) => {
        this.user = user;
      });
  }

  ionViewDidLeave() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  calculateAge(birthdate: string) {
    if (!birthdate) return '';
    return moment().diff(birthdate, 'years');
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
