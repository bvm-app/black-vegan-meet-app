import { Component, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { env } from '../../app/env';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';

/**
 * Generated class for the SwipeToLikePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-swipe-to-like',
  templateUrl: 'swipe-to-like.html',
})
export class SwipeToLikePage {

  cardDirection = "xy";
  cardOverlay: any = {
    like: {
      backgroundColor: '#28e93b'
    },
    dislike: {
      backgroundColor: '#e92828'
    }
  };

  defaultUserImage = env.DEFAULT.userImagePlaceholder;

  users: IUser[];
  potentialMatches: any = [];
  usersSubscription: Subscription;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private sanitizer: DomSanitizer,
    private db: AngularFireDatabase
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwipeToLikePage');
    this.generatePotentialMatches();
  }

  ionViewDidLeave() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }

  onCardInteract(event, user) {
    console.log('on card interact user', user);
  }

  generatePotentialMatches() {

    this.usersSubscription = this.db.list(`/userData`).valueChanges().subscribe((users: IUser[]) => {
      //TODO change implementation typecast users
      this.users = users;
      this.potentialMatches = this.users;
    });

    this.potentialMatches.forEach(element => {
      this.potentialMatches.push({
        likeEvent: new EventEmitter(),
        destroyEvent: new EventEmitter()
      });
    });
  }


}
