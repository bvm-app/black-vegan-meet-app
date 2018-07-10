import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';

/**
 * Generated class for the ReportModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-modal',
  templateUrl: 'report-modal.html',
})
export class ReportModalPage {

  reportReasons = [
    'Abusive User',
    'Incomplete/Nonsense Profile',
    'Indecent Images',
    'Copyright/Cartoon Images',
    'Minor (under 18 years old)',
    'Scammer (Money / Phishing)',
    'Rude Profile Content',
    'Promoting/Selling Stuff',
    'Other'
  ];

  suggestedActions = [
    'Send User a Warning',
    'Delete User\'s Account',
    'Delete Image/Modify profile'
  ];

  reportDetails = {};

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  submitReport(){
    this.viewCtrl.dismiss(this.reportDetails);
  }
}
