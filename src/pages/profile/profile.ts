import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Header,
  ToastController,
  ModalController
} from "ionic-angular";
import { AngularFireDatabase } from "angularfire2/database";
import { IUser } from "../../models/IUser";
import { Subscription } from "rxjs";
import { env } from "../../app/env";
import { UserProvider } from "../../providers/user/user";
import moment from "moment";
import firebase from "firebase";
import { ViewedMeProvider } from "../../providers/viewed-me/viewed-me";
import { NotificationProvider } from "../../providers/notification/notification";
import { PremiumSubscriptionPage } from "../premium-subscription/premium-subscription";
import { BlockProvider } from "../../providers/block/block";
import { EmailProvider } from "../../providers/email/email";
import { ReportModalPage } from "../report-modal/report-modal";
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
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
    private alertCtrl: AlertController,
    private blockProvider: BlockProvider,
    private emailProvider: EmailProvider,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  isBlocked: boolean = false;

  ionViewWillEnter() {
    console.log("ionViewWillEnter ProfilePage");
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

    this.getIsBlocked(userId);
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

    let name = this.user.username || "";
    if (name.trim().length > 0) {
      temp.push(name);
    }

    if (this.user.birthdate) {
      let age = this.calculateAge(this.user.birthdate.toString());
      if (age > 0) {
        temp.push(age.toString());
      }
    }

    return temp.join(", ");
  }

  calculateAge(birthdate: string) {
    if (!birthdate) return "";
    return moment().diff(birthdate, "years");
  }

  formatAddress() {
    return this.userProvider.formatAddress(this.user);
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  goToConversationPage() {
    this.navCtrl.push("ConversationPage", { recipient: this.user });
  }

  openPremiumSubscriptionPage() {
    this.navCtrl.push(PremiumSubscriptionPage);
  }

  openBlockConfirmation(userId: string) {
    if (this.isBlocked) {
      this.blockProvider.unblockUser(userId);
      this.getIsBlocked(this.user.id);
    } else {
      let alert = this.alertCtrl.create({
        title: "Block",
        message: "Are you sure you want to block this user?",
        buttons: [
          {
            text: "No"
          },
          {
            text: "Yes",
            handler: () => {
              this.blockProvider.blockUser(userId);
              this.getIsBlocked(this.user.id);
            }
          }
        ]
      });

      alert.present();
    }
  }

  openReportConfirmation(userId) {
    let alert = this.alertCtrl.create({
      title: "Report User",
      message:
        "You may report users based on inappropriate behaviour or the contents of a user's profile. Reports about interpersonal issues or disputes will be dismissed.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Okay",
          handler: () => {
            let reportModal = this.modalCtrl.create(ReportModalPage);
            reportModal.onDidDismiss(reason => {
              if (reason) {
                let currentUser;
                this.userProvider.getCurrentUser().subscribe(user => {
                  currentUser = user;
                });

                this.emailProvider.emailReport(this.user,currentUser,reason);
                let toast = this.toastCtrl.create({
                  message: "Report has been sent.",
                  duration: 3000,
                  position: "bottom"
                });

                toast.present();
              }
            });
            reportModal.present();
          }
        }
      ]
    });

    alert.present();
  }

  private getIsBlocked(userId: string) {
    let blockSubscription = this.blockProvider
      .checkIfBlocked(userId)
      .subscribe(isBlocked => {
        this.isBlocked = isBlocked;
        blockSubscription.unsubscribe();
      });
  }
}
