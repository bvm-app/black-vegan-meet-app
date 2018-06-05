import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GroceryStore } from '../../models/grocery-store';
import { GroceryStoreModalPage } from '../grocery-store-modal/grocery-store-modal';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
   private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
  }

  openAddGroceryStoreModal() {
    var data = { 'GroceryStore': new GroceryStore(), 'Type': 'Add' };
    var modalPage = this.modalCtrl.create(GroceryStoreModalPage, data);
    modalPage.present();
  }

  navigateTo(page) {
    this.navCtrl.push(page);
  }
}
