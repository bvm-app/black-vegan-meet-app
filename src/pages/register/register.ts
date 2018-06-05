import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from 'ionic-angular';
import moment, { Moment } from 'moment';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserCredential, Error } from '@firebase/auth-types';
import { EnumProvider } from '../../providers/enum/enum';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface IRegisterForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthdate: string | Moment;
  address: string;
}

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  genderOptions: string[];

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
    form.birthdate = moment(form.birthdate).toISOString(true);

    this.afAuth.auth
      .createUserWithEmailAndPassword(form.email, form.password)
      .then((credentials: UserCredential) => {
        console.log('credentials:', credentials);

        let userId = credentials.user.uid;
        let firstName = form.firstName.trim();
        let lastName = form.lastName.trim();

        this.db
          .object(`userData/${userId}`)
          .set({
            id: userId,
            firstName: firstName,
            lastName: lastName,
            birthdate: form.birthdate,
            email: form.email.trim(),
            address: form.address.trim(),
            searchName: `${firstName.toLowerCase()} ${lastName.toLowerCase()}`
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
