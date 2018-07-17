import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SwipeProvider } from "../../providers/swipe/swipe";
import { IUser } from "../../models/IUser";
import { env } from '../../app/env';

/**
 * Generated class for the SeeWhoLikedYouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-see-who-liked-you",
  templateUrl: "see-who-liked-you.html"
})
export class SeeWhoLikedYouPage {

  users: IUser[];
  defaultUserImage = env.DEFAULT.userImagePlaceholder;
  isFetching = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private swipeProvider: SwipeProvider
  ) {}

  ionViewDidLoad() {
    this.swipeProvider.getWhoLikedMe().then(users => {
      this.users = users;
      this.isFetching = false;
    });
  }

  navigateToProfile(user: IUser) {
    if (!user) return;
    this.navCtrl.push('ProfilePage', { userId: user.id });
  }
}
