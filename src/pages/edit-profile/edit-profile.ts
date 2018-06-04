import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { GenderOptions } from '../../enums/GenderOptions';
import { IUser } from '../../models/IUser';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { EnumProvider } from '../../providers/enum/enum';
import moment from 'moment';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
  heightOptions: string[];
  genderOptions: string[];
  dietOptions: string[];
  religionOptions: string[];
  alcoholOptions: string[];
  cigaretteOptions: string[];
  drugOptions: string[];
  childrenOptions: string[];
  educationOptions: string[];
  physicalActivityOptions: string[];
  relationshipStatusOptions: string[];

  user: IUser;
  userSubscription: Subscription;
  isUpdating: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public enumProvider: EnumProvider,
    public toastCtrl: ToastController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
    this.heightOptions = this.enumProvider.getHeightOptions();
    this.genderOptions = this.enumProvider.getGenderOptions();
    this.relationshipStatusOptions = this.enumProvider.getRelationshipStatusOptions();
    this.dietOptions = this.enumProvider.getDietOptions();
    this.religionOptions = this.enumProvider.getReligionOptions();
    this.alcoholOptions = this.enumProvider.getAlcoholOptions();
    this.cigaretteOptions = this.enumProvider.getCigaretteOptions();
    this.drugOptions = this.enumProvider.getDrugOptions();
    this.childrenOptions = this.enumProvider.getChildrenOptions();
    this.educationOptions = this.enumProvider.getEducationOptions();
    this.physicalActivityOptions = this.enumProvider.getPhysicalActivityOptions();

    this.userSubscription = this.db
      .object(`userData/${firebase.auth().currentUser.uid}`)
      .valueChanges()
      .subscribe((user: IUser) => {
        this.user = user;

        if (!this.user.preferences) {
          this.user.preferences = {};
        }

        this.user.birthdate = moment(this.user.birthdate).format('YYYY-MM-DD');
      });
  }

  ionViewDidLeave() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  submitForm() {
    this.isUpdating = true;
    let form = {...this.user};
    form.birthdate = moment(form.birthdate).toISOString(true);
    form.searchName = `${form.firstName.trim().toLowerCase()} ${form.lastName.trim().toLowerCase()}`
    form.searchAddress = `${form.city.trim().toLowerCase()} ${form.state.trim().toLowerCase()} ${form.country.trim().toLowerCase()}`

    this.db.object(`userData/${firebase.auth().currentUser.uid}`).set(form).then(() => {
      this.isUpdating = false;
      this.presentToast('Profile updated!');
    }).catch((err: Error) => {
      console.log('error:', err.message);
      this.isUpdating = false;
      this.presentToast('Oops, something went wrong.');
    });
  }

  presentToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).present();
  }
}
