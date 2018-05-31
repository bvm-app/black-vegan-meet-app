import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCredential } from '@firebase/auth-types';
import { RegisterPage } from '../register/register';
import { StartPage } from '../start/start';

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
  email: string = '';
  password: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public afAuth: AngularFireAuth
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.email = this.email.trim();

    if (this.email.length === 0 || this.password.length === 0) {
      this.presentToast('Invalid credentials');
      return;
    }

    // Authenticate
    let loader = this.loadingCtrl.create({
      content: 'Logging in...',
      dismissOnPageChange: true
    });

    loader.present();

    this.afAuth.auth
      .signInAndRetrieveDataWithEmailAndPassword(this.email, this.password)
      .then((userCredential: UserCredential) => {
        console.log('Sign in success:', userCredential);
        this.navCtrl.setRoot(HomePage);

        this.presentToast('You have successfully signed in!');
      })
      .catch((error: Error) => {
        console.log('login error:', error.message);
        this.presentToast('Wrong username or password!');
        loader.dismiss();
      });
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  presentToast(message: string, duration: number = 3000) {
    this.toastCtrl
      .create({
        message: message,
        duration: duration
      })
      .present();
  }
}
