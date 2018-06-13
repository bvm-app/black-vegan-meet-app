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
    public userProvider: UserProvider,
    public db: AngularFireDatabase,
    public userSearchProvider: UserSearchProvider,
    public geolocationProvider: GeoLocationProvider,
    private alertCtrl: AlertController,
    private conversationProvider: ConversationProvider
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


  }

  ionViewDidLoad() {
    this.checkSwipeData();

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

  checkSwipeData() {
    let subscription = this.db.object(`userSwipeData`).valueChanges().subscribe(users => {
      let userId = firebase.auth().currentUser.uid;

      if (users && users.hasOwnProperty(userId) && users[userId] && users[userId].hasOwnProperty('likedUsers')) {
        let likedIds: string[] = Object.keys(users[userId].likedUsers);
        let mutualLikeIds: string[] = [];

        likedIds.forEach(id => {
          if (users.hasOwnProperty(id) && users[id].hasOwnProperty('likedUsers')) {
            let hasAlsoLikedMe = Object.keys(users[id].likedUsers).find(x => x == userId) != undefined;

            if (hasAlsoLikedMe) {
              mutualLikeIds.push(id);
            }
          }
        });

        if (mutualLikeIds.length > 0) {
          // IF SOMEONE LIKED BACK
          mutualLikeIds.forEach(id => {
            this.db.object(`userData/${id}`).valueChanges().subscribe((user: IUser) => {
              this.presentConfirm(user);
            });
          });

        }
      }
      subscription.unsubscribe();
    });
  }

  presentConfirm(user: IUser) {
    let alert = this.alertCtrl.create({
      title: 'Match Found!',
      message: `${user.firstName} has liked you back. Would you like to message ${user.firstName} now?`,
      buttons: [
        {
          text: 'Later',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.conversationProvider.goToConversation(user);
          }
        }
      ]
    });
    alert.present();
  }
}
