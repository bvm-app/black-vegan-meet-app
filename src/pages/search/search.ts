import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { RefineSearchPage } from '../refine-search/refine-search';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import { UserSearchProvider } from '../../providers/user-search/user-search';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { RefineSearchProvider } from '../../providers/refine-search/refine-search';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  numberOfUsersToLoad: number = 15;
  allUsers: IUser[] = [];
  users: IUser[] = [];
  usersSubscription: Subscription = new Subscription();
  isLoading: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    public modalCtrl: ModalController,
    public userSearchProvider: UserSearchProvider,
    public refineSearchProvider: RefineSearchProvider
  ) {}

  ionViewDidLeave() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

    this.filterUsers(this.navParams.data.filters).then(() => {
      this.isLoading = false;
    });

    // this.usersSubscription = this.userSearchProvider
    //   .getUsers()
    //   .pipe(take(1))
    //   .subscribe((users: IUser[]) => {
    //     this.allUsers = [...users];

    //     this.populateUsersList();

    //     this.isLoading = false;
    //   });
  }

  populateUsersList() {
    this.users = [
      ...this.users,
      ...this.allUsers.splice(0, this.numberOfUsersToLoad)
    ];
  }

  loadMoreUsers(infiniteScroll) {
    setTimeout(() => {
      this.populateUsersList();
      infiniteScroll.complete();
    }, 500);
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }

  openRefineSearchModal() {
    let refineSearchModal = this.modalCtrl.create(RefineSearchPage);
    refineSearchModal.onDidDismiss((data: IRefineSearchFilters) => {
      if (data) this.filterUsers(data);
    });
    refineSearchModal.present();
  }

  filterUsers(filters: IRefineSearchFilters) {
    this.users = [];
    this.isLoading = true;
    this.refineSearchProvider.updateFilters(filters);

    return this.userSearchProvider.filterUsers(filters).then(users => {
      this.allUsers = users;
      this.populateUsersList();
      this.isLoading = false;

      return users;
    });
  }
}
