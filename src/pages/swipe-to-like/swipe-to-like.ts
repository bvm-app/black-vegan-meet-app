import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { env } from '../../app/env';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import moment from 'moment';

import 'rxjs/Rx';
import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';

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

  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  defaultUserImage = env.DEFAULT.userImagePlaceholder;

  users: IUser[];
  potentialMatches: any = [];
  usersSubscription: Subscription;

  cards: Array<any>;
  stackConfig: StackConfig;
  recentCard: string = '';
  backgroundColor: string = '';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: AngularFireDatabase,
    private toastCtrl: ToastController
  ) {
    this.stackConfig = {
      throwOutConfidence: (offsetX, offsetY, element) => {
        return Math.min(Math.abs(offsetX) / (element.offsetWidth/2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 1200;
      }
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SwipeToLikePage');

    this.generatePotentialMatches();
  }

  ionViewDidLeave() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }

  onItemMove(element, x, y, r) {
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16*16 - abs, 16*16));
    let hexCode = this.decimalToHex(min, 2);
    
    if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }
    this.backgroundColor = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  voteUp(like: boolean) {
    this.backgroundColor = '';
    
    let removedCard = this.potentialMatches.shift();
    // this.addNewCards(1);
    if (like) {
      this.recentCard = 'You liked ' + removedCard.firstName;
    } else {
      this.recentCard = 'You disliked ' + removedCard.firstName;
    }

    this.presentToast(this.recentCard);
  }

  presentToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    
    while (hex.length < padding) {
      hex = "0" + hex;
    }
    
    return hex;
  }

  generatePotentialMatches() {
    this.usersSubscription = this.db.list(`/userData`).valueChanges().subscribe((users: IUser[]) => {
      //TODO change implementation typecast users
      this.users = users;
      this.potentialMatches = this.users;
    });
  }

  navigateToProfile(user: IUser) {
    if (!user) return;
    this.navCtrl.push('ProfilePage', { userId: user.id });
  }

  calculateAge(birthdate: string) {
    if (!birthdate) return '';
    return moment().diff(birthdate, 'years');
  }

}
