import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GroceryStoreModalPage } from '../grocery-store-modal/grocery-store-modal';
import { RestaurantModalPage } from '../restaurant-modal/restaurant-modal';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
  }

  openGroceryStoreModal() {
    let modal = this.modalCtrl.create(GroceryStoreModalPage, { Type: 'Add' });
    modal.present();
  }

  openRestaurantModal() {
    let modal = this.modalCtrl.create(RestaurantModalPage, { Type: 'Add' });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
