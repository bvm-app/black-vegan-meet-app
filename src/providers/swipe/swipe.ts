import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import firebase from "firebase";
import { IUser } from "../../models/IUser";
import { AlertController } from "ionic-angular";
import { ConversationProvider } from "../conversation/conversation";
import { UserProvider } from "../user/user";

/*
  Generated class for the SwipeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SwipeProvider {
  dbPath = "userSwipeData";
  private currentLoggedInUserId = firebase.auth().currentUser.uid;
  swipeRef;

  constructor(
    private db: AngularFireDatabase,
    private alertCtrl: AlertController,
    private conversationProvider: ConversationProvider
  ) {}

  updateUserSwipeData(userId: string, liked: boolean) {
    if (liked) {
      this.swipeRef = this.db
        .object(
          `${this.dbPath}/${this.currentLoggedInUserId}/likedUsers/${userId}`
        )
        .set(true);
      this.db
        .object(
          `${this.dbPath}/${userId}/whoLikedMe/${this.currentLoggedInUserId}`
        )
        .set(true);

      let subscription = this.db
        .object(`${this.dbPath}/${userId}/likedUsers`)
        .valueChanges()
        .subscribe(likedUsers => {
          if (
            likedUsers &&
            likedUsers.hasOwnProperty(this.currentLoggedInUserId)
          ) {
            // console.log('Match!');
            this.db
              .object(
                `${this.dbPath}/${
                  this.currentLoggedInUserId
                }/matchedUsers/${userId}`
              )
              .set(false);
            this.db
              .object(
                `${this.dbPath}/${userId}/matchedUsers/${
                  this.currentLoggedInUserId
                }`
              )
              .set(false);
          }

          // console.log(likedUsers);
          subscription.unsubscribe();
        });
    } else {
      this.swipeRef = this.db
        .object(
          `${this.dbPath}/${this.currentLoggedInUserId}/dislikedUsers/${userId}`
        )
        .set(true);
    }

    return this.swipeRef;
  }

  async notifyMatchedUsers() {
    let subscription = this.db
      .object(`userSwipeData/${this.currentLoggedInUserId}/matchedUsers`)
      .valueChanges()
      .subscribe(matchedUsers => {
        if (matchedUsers) {
          for (let key in matchedUsers) {
            if (matchedUsers[key] === false) {
              let userSubscription = this.db
                .object(`userData/${key}`)
                .valueChanges()
                .subscribe((user: IUser) => {
                  this.showMatchedNotification(user);
                  userSubscription.unsubscribe();
                });
            }
            this.db
              .object(
                `userSwipeData/${
                  this.currentLoggedInUserId
                }/matchedUsers/${key}`
              )
              .set(true);
          }
        }

        subscription.unsubscribe();
      });
  }

  // get
  async getWhoLikedMe(): Promise<IUser[]> {
    let userIds = await this.db
      .object(`userSwipeData/${this.currentLoggedInUserId}/whoLikedMe`)
      .valueChanges().take(1)
      .toPromise();

    let users = [];

    if (userIds) {
      for (let id of Object.keys(userIds)) {
         let user = await this.db
          .object(`userData/${id}`)
          .valueChanges().take(1)
          .map(x => x as IUser)
          .toPromise();

        if (user) {
          users.push(user);
        }
      }
    }

    return users;
  }

  showMatchedNotification(user: IUser) {
    let alert = this.alertCtrl.create({
      title: "Match Found!",
      message: `${
        user.username
      } has liked you back. Would you like to message ${user.username} now?`,
      buttons: [
        {
          text: "Later",
          role: "cancel",
          handler: () => {
            // console.log('see you later');
          }
        },
        {
          text: "Yes",
          handler: () => {
            // this.db.object(`userSwipeData/${this.currentLoggedInUserId}/matchedUsers/${user.id}`).set(true);
            this.conversationProvider.goToConversation(user);
          }
        }
      ]
    });
    alert.present();
  }
}
