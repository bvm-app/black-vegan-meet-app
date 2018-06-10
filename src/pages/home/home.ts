import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { UserSearchProvider } from '../../providers/user-search/user-search';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  defaultUserImage = env.DEFAULT.userImagePlaceholder;
  icons = env.DEFAULT.icons;
  maximumProspectDatesCount = 25;

  prospectDates: IUser[];
  prospectDatesSubscription: Subscription = new Subscription();

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider, // Trigger constructor of userProvider
    public db: AngularFireDatabase,
    public userSearchProvider: UserSearchProvider,
    public geolocationProvider: GeoLocationProvider
  ) {
    this.prospectDates = [...Array(this.maximumProspectDatesCount)].fill({
      profilePictureUrl: this.defaultUserImage
    });
  }

  ionViewDidLeave() {
    if (this.prospectDatesSubscription)
      this.prospectDatesSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.prospectDatesSubscription = this.userSearchProvider
      .getUsers()
      .subscribe((users: IUser[]) => {
        this.prospectDates = [...users.slice(0, this.maximumProspectDatesCount)];
        this.prospectDatesSubscription.unsubscribe();
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
