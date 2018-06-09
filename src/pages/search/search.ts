import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { IUser } from '../../models/IUser';
import { RefineSearchPage } from '../refine-search/refine-search';
import { IRefineSearchFilters } from '../../models/IRefineSearchFilters';
import { UserSearchProvider } from '../../providers/user-search/user-search';
import { Subscription } from 'rxjs';

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
    public userSearchProvider: UserSearchProvider
  ) {}

  ionViewDidLeave() {
    if (this.usersSubscription) this.usersSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

    this.usersSubscription = this.userSearchProvider.getUsers()
      .subscribe((users: IUser[]) => {
        // this.allUsers = [...users];

        for (let item of [...Array(10)].fill(0)) {
          this.allUsers = [...this.allUsers, ...users];
        }

        this.populateUsersList();

        this.isLoading = false;

        this.usersSubscription.unsubscribe();
      });
  }

  populateUsersList() {
    this.users = [...this.users, ...this.allUsers.splice(0, this.numberOfUsersToLoad)];
    // const listDifference = this.allUsers.length - this.users.length;
    // const numberOfUsersToSlice = (listDifference > this.numberOfUsersToLoad) ? this.numberOfUsersToLoad: listDifference;

    // this.users = [...this.users, ...this.allUsers.slice(this.users.length, this.users.length + numberOfUsersToSlice)];
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
      this.filterUsers(data);
    });
    refineSearchModal.present();
  }

  filterUsers(filters: IRefineSearchFilters) {
    this.users = [];
    this.allUsers = this.userSearchProvider.filterUsers(filters);
    this.populateUsersList();
  }
}
