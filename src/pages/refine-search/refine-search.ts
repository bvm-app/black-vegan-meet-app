import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { RefineSearchProvider } from '../../providers/refine-search/refine-search';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import { EnumProvider } from '../../providers/enum/enum';
import { UserProvider } from '../../providers/user/user';
import { IUser } from '../../models/IUser';

/**
 * Generated class for the RefineSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-refine-search',
  templateUrl: 'refine-search.html'
})
export class RefineSearchPage {
  shouldBeRemovedFromNavStackAfterInput: boolean = false;
  user: IUser;
  filters: IRefineSearchFilters | any = {};
  heightOptions: string[] = [];
  genderOptions: string[] = [];
  religionOptions: string[] = [];
  childrenOptions: string[] = [];
  intentionOptions: string[] = [];
  dietOptions: string[] = [];
  educationOptions: string[] = [];
  drugOptions: string[] = [];
  alcoholOptions: string[] = [];
  cigaretteOptions: string[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public enumProvider: EnumProvider,
    public refineSearchProvider: RefineSearchProvider,
    public userProvider: UserProvider,
    public viewCtrl: ViewController
  ) {
    this.filters = this.refineSearchProvider.getFilters();
    this.initVariables();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RefineSearchPage');
    this.shouldBeRemovedFromNavStackAfterInput = this.navParams.data.shouldBeRemovedFromNavStackAfterInput;
    this.initVariables();
  }

  initVariables() {
    this.userProvider.getCurrentUser().subscribe(user => this.user = user);

    this.heightOptions = this.enumProvider.getHeightOptions();
    this.genderOptions = this.enumProvider.getGenderOptions();
    this.religionOptions = this.enumProvider.getReligionOptions();
    this.childrenOptions = this.enumProvider.getChildrenOptions();
    this.intentionOptions = this.enumProvider.getIntentionOptions();
    this.dietOptions = this.enumProvider.getDietOptions();
    this.educationOptions = this.enumProvider.getEducationOptions();
    this.drugOptions = this.enumProvider.getDrugOptions();
    this.alcoholOptions = this.enumProvider.getAlcoholOptions();
    this.cigaretteOptions = this.enumProvider.getCigaretteOptions();
  }

  formatAgeRange() {
    if (!this.filters.ageRange) return;
    return `${this.filters.ageRange.lower} - ${this.filters.ageRange.upper}`;
  }

  formatHeightRange() {
    if (!this.filters.heightRangeIndex) return;
    return `${this.heightOptions[this.filters.heightRangeIndex.lower]} - ${this.heightOptions[this.filters.heightRangeIndex.upper]}`
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  filterUsers() {
    if (this.shouldBeRemovedFromNavStackAfterInput) {
      this.navCtrl.push('SearchPage', { filters: this.filters }).then(() => {
        const startIndex = this.navCtrl.getActive().index - 1;
        this.navCtrl.remove(startIndex, 1);
      });
    } else {
      this.viewCtrl.dismiss(this.filters);
    }
  }
}
