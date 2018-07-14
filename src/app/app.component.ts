import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StartPage } from '../pages/start/start';

import * as firebase from 'firebase';
import { env } from './env';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

declare var google;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;

  rootPage: any = StartPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public afAuth: AngularFireAuth,
  ) {
    if (!firebase.apps.length) {
      firebase.initializeApp(env.FIREBASE);
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      this.afAuth.authState.subscribe((user: firebase.User) => {
        this.nav.setRoot(!user ? LoginPage : HomePage);
        splashScreen.hide();
        // this.navCtrl.setRoot(!user ? LoginPage : HomePage);
      });
    });
  }
}
