import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.afAuth.authState.subscribe((user: firebase.User) => {
      // this.navCtrl.setRoot(!user ? LoginPage : TabsPage);
    });
  }

  login() {
    // Authenticate
    this.navCtrl.setRoot(HomePage);
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }
}
