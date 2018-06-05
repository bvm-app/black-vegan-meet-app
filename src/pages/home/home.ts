import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  defaultUserImage = env.DEFAULT.userImagePlaceholder;
  icons = env.DEFAULT.icons;
  maximumProspectDatesCount = 25;

  prospectDates: IUser[];
  prospectDatesSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider, // Trigger constructor of userProvider
    public db: AngularFireDatabase
  ) {
    this.prospectDates = [...Array(this.maximumProspectDatesCount)].fill({
      profilePictureUrl: this.defaultUserImage
    });
  }

  ionViewDidLeave() {
    if (this.prospectDatesSubscription) this.prospectDatesSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.prospectDatesSubscription = this.db
      .list('userData', ref => ref.orderByChild('lastActive'))
      .valueChanges()
      .subscribe((users: IUser[]) => {
        this.prospectDates = users;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

    this.userProvider.initOnlinePresence();
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  navigateToProfile(user: IUser) {
    if (!user) return;
    this.navCtrl.push('ProfilePage', { userId: user.id });
  }
}
