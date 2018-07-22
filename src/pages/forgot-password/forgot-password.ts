import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AdMobFree, AdMobFreeBannerConfig } from '../../../node_modules/@ionic-native/admob-free';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  forgotPasswordForm: FormGroup;
  submitAttempt: boolean = false;
  email: string;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afAuth: AngularFireAuth, private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private admob: AdMobFree) {

    this.forgotPasswordForm = formBuilder.group({
      email: ['',
        Validators.compose(
          [Validators.maxLength(255),
          Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'),
          Validators.required])
      ],
    });
  }

  showBanner() {
    let bannerConfig: AdMobFreeBannerConfig = {
      isTesting: true, // Remove in production
      autoShow: true,
      id: 'ca-app-pub-4917220357544982/9420529379'
    };

    this.admob.banner.config(bannerConfig);

    this.admob.banner.prepare().then(() => {
      // success
      this.admob.banner.show();
      console.log("SUCCESS BANNER");
    }).catch(e => {
      console.log("ERROR: ", e);
    });
  }

  ionViewDidEnter() {
    this.showBanner();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  submit() {
    this.submitAttempt = true;

    if (this.forgotPasswordForm.valid) {
      let loading = this.loadingCtrl.create({
        content: 'Submitting request...'
      });
      loading.present();
      this.afAuth.auth.sendPasswordResetEmail(this.email).then(res => {
        this.navCtrl.pop();
        this.presentToast('A recovery email has been sent.');
        loading.dismiss();
      },
        err => {
          this.presentToast('This email is not registered in the application.');
          loading.dismiss();
        });
    }
  }

  presentToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
      })
      .present();
  }

}
