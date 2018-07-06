import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
// import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

/**
 * Generated class for the StartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    // public afAuth: AngularFireAuth,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }
}
