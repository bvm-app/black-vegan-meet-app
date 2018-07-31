import { Component, ViewChild, ViewChildren, QueryList } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Slides,
  ViewController,
  AlertController
} from "ionic-angular";
import { env } from "../../app/env";
import { Subscription } from "rxjs/Subscription";
import { AngularFireDatabase } from "angularfire2/database";
import { IUser } from "../../models/IUser";
import moment from "moment";
import firebase from "firebase";
import "rxjs/Rx";
import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent
} from "angular2-swing";
import { SwipeProvider } from "../../providers/swipe/swipe";
import { GeoLocationProvider } from "../../providers/geo-location/geo-location";
import { UserSearchProvider } from "../../providers/user-search/user-search";
import { take } from "rxjs/operators";
import { UserProvider } from "../../providers/user/user";
import { SeeWhoLikedYouPage } from "../see-who-liked-you/see-who-liked-you";
import { PremiumSubscriptionProvider } from "../../providers/premium-subscription/premium-subscription";
/**
 * Generated class for the SwipeToLikePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-swipe-to-like",
  templateUrl: "swipe-to-like.html"
})
export class SwipeToLikePage {
  cordova = window["cordova"];
  @ViewChild(Slides) slides: Slides;
  @ViewChild("myswing1") swingStack: SwingStackComponent;
  @ViewChildren("mycards1") swingCards: QueryList<SwingCardComponent>;

  defaultUserImagePlaceholder = env.DEFAULT.userImagePlaceholder;

  potentialMatches: IUser[];
  usersSubscription: Subscription;

  stackConfig: StackConfig;
  recentCard: string = "";
  backgroundColor: string = "";

  currentPosition: any;
  isFetching = true;

  isQuickView: boolean = false;
  isPremiumSubscriber: boolean = false;
  isAdvancedSubscriber: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: AngularFireDatabase,
    private toastCtrl: ToastController,
    private swipeProvider: SwipeProvider,
    private geolocationProvider: GeoLocationProvider,
    private userSearchProvider: UserSearchProvider,
    private userProvider: UserProvider,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private premiumSubscriptionProvider: PremiumSubscriptionProvider
  ) {
    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: d => {
        return 1200;
      }
    };

    if (navParams.get("isQuickView")) {
      this.isQuickView = navParams.get("isQuickView");
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SwipeToLikePage');
    this.generatePotentialMatches();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goToSeeWhoLikedYouPage() {
    //todo add see who liked you
    this.navCtrl.push(SeeWhoLikedYouPage);
  }

  ionViewDidEnter() {
    // console.log('this user has subscription', this.premiumSubscriptionProvider.hasAdvanceSubscription());
    if (!this.isQuickView) {
      if (this.premiumSubscriptionProvider.hasSubscription()) {
        this.isPremiumSubscriber = this.premiumSubscriptionProvider.hasPremiumSubscription();
        this.isAdvancedSubscriber = this.premiumSubscriptionProvider.hasAdvanceSubscription();
      }
    }
  }

  ionViewDidLeave() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }

  onItemMove(element, x, y, r) {
    var color = "";
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    let hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = "#FF" + hexCode + hexCode;
    } else {
      color = "#" + hexCode + "FF" + hexCode;
    }
    this.backgroundColor = color;
    element.style[
      "transform"
    ] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  voteUp(liked: boolean, potentialMatch: IUser) {
    this.backgroundColor = "";

    let removedCard = this.potentialMatches.pop();

    if (liked) {
      this.recentCard = "You liked " + removedCard.username;
    } else {
      this.recentCard = "You disliked " + removedCard.username;
    }

    this.updatePotentialMatches(this.allPotentialMatches.indexOf(removedCard));
    // this.presentToast(this.recentCard);
    this.swipeProvider.updateUserSwipeData(potentialMatch.id, liked);

    if (this.potentialMatches.length <= 0 && this.isQuickView) {
      let alert = this.alertCtrl.create({
        title: "Notice",
        message: "That's it for the quick view. Happy dating! ",
        buttons: [
          {
            text: "Okay",
            role: "cancel",
            handler: () => {
              this.dismiss();
            }
          }
        ]
      });
      alert.present();
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding =
      typeof padding === "undefined" || padding === null
        ? (padding = 2)
        : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }

  private allPotentialMatches: IUser[];
  generatePotentialMatches() {
    this.geolocationProvider.getCurrentPosition().then(res => {
      this.userSearchProvider
        .sortByDistanceFromCoordinates(res.coords)
        .then(users => {
          users = [...users];

          let currentUser = users.find(
            x => x.id == firebase.auth().currentUser.uid
          );

          if (currentUser) {
            users.splice(users.indexOf(currentUser), 1);
          }

          this.db
            .object(`userSwipeData/${firebase.auth().currentUser.uid}`)
            .valueChanges()
            .pipe(take(1))
            .subscribe(userSwipeData => {
              if (userSwipeData) {
                let usersAlreadyMatched: string[] = [];

                if (userSwipeData.hasOwnProperty("likedUsers")) {
                  Object.keys(userSwipeData["likedUsers"]).forEach(x =>
                    usersAlreadyMatched.push(x)
                  );
                }

                if (userSwipeData.hasOwnProperty("dislikedUsers")) {
                  Object.keys(userSwipeData["dislikedUsers"]).forEach(x =>
                    usersAlreadyMatched.push(x)
                  );
                }

                usersAlreadyMatched.forEach(id => {
                  let userToRemove = users.find(x => x.id == id);

                  if (userToRemove) {
                    users.splice(users.indexOf(userToRemove), 1);
                  }
                });
              }

              users.forEach(x => {
                if (!x.images) {
                  x.images = [this.defaultUserImagePlaceholder];
                }
              });

              this.allPotentialMatches = users;
              if (this.isQuickView) {
                let startIndex = this.allPotentialMatches.length - 10;

                this.allPotentialMatches = this.allPotentialMatches.slice(
                  startIndex < 0 ? 0 : startIndex,
                  this.allPotentialMatches.length
                );
              }

              this.updatePotentialMatches(this.allPotentialMatches.length);
              if(this.potentialMatches.length <= 0 && this.isQuickView){
                let alert = this.alertCtrl.create({
                  title: "Notice",
                  message: "Sorry, you do not have any potential matches as of yet. Improve your profile and get some matches",
                  buttons: [
                    {
                      text: "Okay",
                      role: "cancel",
                      handler: () => {
                        this.dismiss();
                      }
                    }
                  ]
                });
                alert.present();
              }
              this.isFetching = false;
            });
        });
    });
  }

  updatePotentialMatches(endIndex: number) {
    let startIndex = endIndex == 1 ? 0 : endIndex - 2;
    this.potentialMatches = this.allPotentialMatches.slice(
      startIndex,
      endIndex
    );

    setTimeout(() => {
      this.potentialMatches.forEach(x => {
        this.changeImage(0, x.id, x.images.length);
      });
    }, 0);
  }

  navigateToProfile(user: IUser) {
    if (!user) return;
    this.navCtrl.push("ProfilePage", { userId: user.id });
  }

  calculateAge(birthdate: string) {
    if (!birthdate) return "";
    return moment().diff(birthdate, "years");
  }

  formatAddress(user: IUser) {
    if(this.cordova) return false;
    return this.userProvider.formatAddress(user);
  }

  changeImage(index: number, id: string, length: number) {
    for (let i = 0; i < length; i++) {
      let image = document.getElementById(
        `image${id}-${i}`
      ) as HTMLImageElement;
      image.style.opacity = "0";
    }

    let image = document.getElementById(
      `image${id}-${index}`
    ) as HTMLImageElement;
    image.style.opacity = "1";
  }

  createId(index: number, id: string) {
    return `image${id}-${index}`;
  }
}
