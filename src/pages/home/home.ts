import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { env } from '../../app/env';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { UserSearchProvider } from '../../providers/user-search/user-search';
import { GeoLocationProvider } from '../../providers/geo-location/geo-location';
import firebase from 'firebase';
import { take } from 'rxjs/internal/operators/take';
import { ConversationProvider } from '../../providers/conversation/conversation';
import { NotificationProvider } from '../../providers/notification/notification';
import { INotifications } from '../../models/INotifications';
import { SwipeProvider } from '../../providers/swipe/swipe';

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
  notifications: INotifications = {};

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public db: AngularFireDatabase,
    public userSearchProvider: UserSearchProvider,
    public geolocationProvider: GeoLocationProvider,
    private conversationProvider: ConversationProvider,
    private notificationProvider: NotificationProvider,
    private swipeProvider: SwipeProvider
  ) { }

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

    this.notificationProvider.getNotifications().subscribe(notifications => {
      if (notifications && notifications.messages) {
        notifications.messages = Object.keys(notifications.messages);
      }
      console.log('new notifications:', notifications);

      this.notifications = notifications || {};
    });

    this.swipeProvider.notifyMatchedUsers();
  }

  ionViewDidLoad() {


    this.userProvider.initOnlinePresence();
    this.userProvider.initCurrentUser();
    this.userProvider.initAdminStatus();
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  navigateToProfile(user: IUser) {
    if (!user) return;
    this.navCtrl.push('ProfilePage', { userId: user.id });
  }

}
