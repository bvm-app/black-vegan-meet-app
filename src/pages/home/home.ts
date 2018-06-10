import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { UserSearchProvider } from '../../providers/user-search/user-search';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import firebase from 'firebase';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  defaultUserImage = env.DEFAULT.userImagePlaceholder;
  icons = env.DEFAULT.icons;
  maximumProspectDatesCount = 25;

  user: IUser;
  isLoading: boolean = true;

  prospectDates: IUser[] = [];
  currentLoggedInUserSubscription: Subscription = new Subscription();

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider, // Trigger constructor of userProvider
    public db: AngularFireDatabase,
    public userSearchProvider: UserSearchProvider,
    public geolocationProvider: GeoLocationProvider
  ) {}

  ionViewDidLeave() {
    if (this.currentLoggedInUserSubscription)
      this.currentLoggedInUserSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.currentLoggedInUserSubscription = this.db
      .object(`userData/${firebase.auth().currentUser.uid}`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((user: IUser) => {
        this.user = user;
        this.isLoading = false;
        if (user.geolocation) {
          this.userSearchProvider
            .filterUsersByDistanceFromCoordinates(user.geolocation)
            .then(users => {
              this.prospectDates = users;
            });
        }
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
