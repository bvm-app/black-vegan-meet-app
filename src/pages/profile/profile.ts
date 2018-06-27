import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import moment from 'moment';
import firebase from 'firebase';
import { ViewedMeProvider } from '../../providers/viewed-me/viewed-me';
import { NotificationProvider } from '../../providers/notification/notification';
import { PremiumSubscriptionPage } from '../premium-subscription/premium-subscription';

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
  defaultUserImagePlaceholder = env.DEFAULT.icons.Logo;
  centeredSlides = true;
  currentLoggedInUserId: string;

  isCurrentLoggedInUser: boolean = true;
  isPremiumSubscriber: boolean = false;
  user: IUser;
  userSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public userProvider: UserProvider,
    public viewedMeProvider: ViewedMeProvider,
    public notificationProvider: NotificationProvider,
  ) { }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProfilePage');
    this.currentLoggedInUserId = firebase.auth().currentUser.uid;

    let userId = firebase.auth().currentUser.uid;
    if (this.navParams.data.userId) {
      userId = this.navParams.data.userId;
      this.isCurrentLoggedInUser = this.currentLoggedInUserId === userId;
    }

    this.userSubscription = this.db
      .object(`userData/${userId}`)
      .valueChanges()
      .subscribe((user: IUser) => {
        this.user = user;

        if (!this.user.images) {
          this.user.images = [this.defaultUserImagePlaceholder];
        }

        if (!this.user.preferences) {
          this.user.preferences = {};
        }


      });

    // Update userViewedMeData of this user
    if (!this.isCurrentLoggedInUser) {
      this.viewedMeProvider.updateCurrentUserViewedMe(userId);
      this.notificationProvider.setViewedMeNotification(userId);
    }
  }

  ionViewDidEnter() {
    this.isPremiumSubscriber = this.userProvider.getPremiumStatus();
    console.log("IS PREMIUM: ", this.userProvider.getPremiumStatus());
  }

  ionViewDidLeave() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  formatNameAndAge() {
    if (!this.user) return;
    let temp = [];

    let name = this.user.username || '';
    if (name.trim().length > 0) {
      temp.push(name);
    }

    if (this.user.birthdate) {
      let age = this.calculateAge(this.user.birthdate.toString());
      if (age > 0) {
        temp.push(age.toString())
      }
    }

    return temp.join(', ');
  }

  calculateAge(birthdate: string) {
    if (!birthdate) return '';
    return moment().diff(birthdate, 'years');
  }

  formatAddress() {
    return this.userProvider.formatAddress(this.user);
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  goToConversationPage() {
    this.navCtrl.push('ConversationPage', { recipient: this.user })
  }

  openPremiumSubscriptionPage() {
    this.navCtrl.push(PremiumSubscriptionPage);
  }
}
