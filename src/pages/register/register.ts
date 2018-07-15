import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserCredential, Error } from '@firebase/auth-types';
import { EnumProvider } from '../../providers/enum/enum';
import firebase from 'firebase';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface IRegisterForm {
  email: string;
  password: string;
  username: string;
  gender: string;
}

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  confirmAge: boolean = false;
  genderOptions = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public enumProvider: EnumProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');

    this.genderOptions = this.enumProvider.getGenderOptions();
  }

  submitForm(registerFormValue: IRegisterForm) {
    console.log('submittingForm');
    let loader = this.loadingCtrl.create({
      content: 'Registering...',
      dismissOnPageChange: true
    });
    loader.present();

    let form = { ...registerFormValue };

    this.afAuth.auth
      .createUserWithEmailAndPassword(form.email, form.password)
      .then((credentials: UserCredential) => {
        console.log('credentials:', credentials);

        firebase.auth().currentUser.sendEmailVerification();

        const isNewUser = credentials.additionalUserInfo.isNewUser;
        if (isNewUser) window.localStorage.setItem('isNewUser', `true`);

        let userId = credentials.user.uid;
        let username = form.username.trim();
        let gender = form.gender;

        this.db
          .object(`userData/${userId}`)
          .set({
            id: userId,
            username: username,
            email: form.email.trim(),
            gender: gender,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
          })
          .then(() => {
            this.presentToast('You have successfully registered');
          })
          .catch((error: Error) => {
            console.log('Saving user to DB failed:', error.message);
            this.presentToast('Oops something went wrong!');
            loader.dismiss();
          });
      })
      .catch((error: Error) => {
        console.log('register error:', error.message);
        this.presentToast(error.message);
        loader.dismiss();
      });
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
