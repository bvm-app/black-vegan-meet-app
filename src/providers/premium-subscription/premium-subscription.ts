import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { UserProvider } from "../user/user";
import { IUser } from "../../models/IUser";
import { Subscription } from "rxjs";
import { PremiumSubscriptionType } from "../../enums/PremiumSubscriptionType";

/*
  Generated class for the PremiumSubscriptionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PremiumSubscriptionProvider {
  private user: IUser;
  private userSubscription: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private userProvider: UserProvider
  ) {
    console.log("Hello PremiumSubscriptionProvider Provider");
  }

  presentPremiumModal() {
    // TODO
    // present premium options modal
    let alert = this.alertCtrl.create({
      title: "BVM Premium Nag Screen",
      subTitle:
        "Replace this with the proper modal page after premium feature has been implemented!",
      buttons: ["Ok"]
    });
    alert.present();
  }

  hasSubscription() {
      return !!this.user.premiumSubscriptionType;

  }

  hasPremiumSubscription() {

      return (
        this.user.premiumSubscriptionType === PremiumSubscriptionType.PREMIUM
      );
    
  }

  hasAdvanceSubscription() {

      return (
        this.user.premiumSubscriptionType === PremiumSubscriptionType.ADVANCE
      );
    
  }

  init() {
    this.userSubscription = this.userProvider
      .getCurrentUser()
      .subscribe(user => {
        this.user = user;
      });
  }

  unsubscribeSubscriptions() {
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
