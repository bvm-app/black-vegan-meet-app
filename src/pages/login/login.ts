import { Component, ChangeDetectorRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCredential, AuthProvider } from '@firebase/auth-types';
import { RegisterPage } from '../register/register';
import { StartPage } from '../start/start';
import { env } from '../../app/env';
import * as firebase from 'firebase/app';
import { UserProvider } from '../../providers/user/user';
import { FirebaseNameOrConfigToken } from 'angularfire2';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

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
  cordova = window['cordova'];
  email: string = '';
  password: string = '';
  logo: string = env.DEFAULT.icons.LogoWithText;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public afAuth: AngularFireAuth,
    private ref: ChangeDetectorRef,
    private userProvider: UserProvider,
    private facebook: Facebook,
    private googlePlus: GooglePlus
  ) { }

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
        this.presentToast('You have successfully signed in!');
      })
      .catch((error: Error) => {
        console.log('login error:', error.message);
        this.presentToast('Wrong username or password!');
        loader.dismiss();
      });
  }

  loginThirdParty(method: string) {
    console.log("LOGIN FB");

    let loader = this.getLoader('Logging in...');
    loader.present();

    if (!this.cordova) {
      this.afAuth.auth
        .signInWithPopup(this.getAuthProvider(method))
        .then((userCredential: UserCredential) => {
          this.userProvider.saveUserData(userCredential, method);

          if (userCredential.additionalUserInfo.isNewUser) {
            this.userProvider.saveUserData(userCredential, method);
          }

          this.ref.detectChanges(); //A fix taken from: https://stackoverflow.com/questions/46479930/signinwithpopup-promise-doesnt-execute-the-catch-until-i-click-the-ui-angular
        })
        .catch((error: Error) => {
          loader.dismiss();
          console.log('signin error', error);
          this.ref.detectChanges(); //A fix taken from: https://stackoverflow.com/questions/46479930/signinwithpopup-promise-doesnt-execute-the-catch-until-i-click-the-ui-angular
        });
    } else {
      if (method === 'facebook') {
        this.facebook.login(['email', 'public_profile']).then((response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

          firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
            .then((success) => {
              console.log("Firebase success: ", success);
              console.log("Firebase success: ", success.additionalUserInfo['profile']['first_name']);
              if (success.additionalUserInfo.isNewUser) {
                this.userProvider.saveUserData(success, method);
              }
            })
            .catch((error) => {
              console.log("Firebase failure: " + JSON.stringify(error));
            });

        }).catch((error) => { console.log(error) });
      } else {
        this.googlePlus.login({})
          .then(res => {
            console.log("RES!: ", res);

            firebase.auth().signInAndRetrieveDataWithCredential(firebase.auth.GoogleAuthProvider.credential(null, res.accessToken))
              .then((success) => {
                console.log("Firebase success: ", success);
                if (success.additionalUserInfo.isNewUser) {
                  this.userProvider.saveUserData(success, method);
                }
              })
              .catch((error) => {
                console.log("Firebase failure: " + JSON.stringify(error));
              });
          })
          .catch(err => {
            console.error(err);
            loader.dismiss();
          });
      }
    }
  }

  getAuthProvider(method: string) {

    switch (method.toLocaleLowerCase()) {
      case 'facebook':
        let fbProvider = new firebase.auth.FacebookAuthProvider();
        fbProvider.setCustomParameters({
          prompt: 'select_account'
        });
        return fbProvider;
      case 'google':
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.setCustomParameters({
          prompt: 'select_account'
        });
        return googleProvider;
    }
  }

  private getLoader(content: string, dismissOnPageChange: boolean = true) {
    return this.loadingCtrl.create({
      content: content,
      dismissOnPageChange: dismissOnPageChange
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

  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);

  }
}
