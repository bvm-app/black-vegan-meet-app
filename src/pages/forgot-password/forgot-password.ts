import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

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
    private loadingCtrl: LoadingController, private toastCtrl: ToastController) {

    this.forgotPasswordForm = formBuilder.group({
      email: ['', 
      Validators.compose(
        [Validators.maxLength(255), 
          Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})'), 
          Validators.required])
        ],
    });
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
