import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform,
  ToastController
} from "ionic-angular";
import { PayPalPayment } from "@ionic-native/paypal";
import { IPremiumOption } from "../../models/IPremiumOption";
import { PremiumSubscriptionOptionsProvider } from "../../providers/premium-subscription-options/premium-subscription-options";
import { UserProvider } from "../../providers/user/user";
import { UserTransactionProvider } from "../../providers/user-transaction/user-transaction";
import { IUser } from "../../models/IUser";
import { AngularFireDatabase } from "angularfire2/database";
import { InAppPurchase } from "../../../node_modules/@ionic-native/in-app-purchase";

// PREMIUM
const PREMIUM_1_MONTH = "premium_1_month";
const PREMIUM_6_MONTH = "premium_6_month";
const PREMIUM_1_YEAR = "premium_1_year";

// ADVANCED
const ADVANCED_1_MONTH = "com.bvm.app.advanced_1_month";
const ADVANCED_6_MONTH = "com.bvm.app.advanced_6_month";
const ADVANCED_1_YEAR = "com.bvm.app.advanced_1_year";

/**
 * Generated class for the PremiumSubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare let paypal: any;

@IonicPage()
@Component({
  selector: "page-premium-subscription",
  templateUrl: "premium-subscription.html"
})
export class PremiumSubscriptionPage {
  isMobileApp: boolean;
  inAppProducts = [];
  isPremium: boolean;

  cordova = window["cordova"];

  user: IUser;
  payment: PayPalPayment;
  options: IPremiumOption[] = [];
  selectedOptionId: number;
  selectedOption: IPremiumOption = {
    id: 0,
    name: "",
    description: "",
    price: 0,
    savePercentage: 0,
    selected: false,
    duration: 0
  };

  addScript: boolean = false;
  paypalLoad: boolean = true;
  finalAmount: number = 1;
  paypalConfig = {
    env: "sandbox",
    client: {
      sandbox:
        "ATiVmaN_xR5Qy_795IYQEcVRoYBilmhV2-9SaARdhq0tD7Qg8QqLLwbp_GdPU219RSCUfNLHU9ZL6of0",
      production:
        "ATPD8IsAs7xpZXhu-P1EMXKF1Ak85GH1hhTAYMoaq-MzUarsRLa_CVIFGjhnQqLn2NUwA1tiqVJf_caa"
    },
    commit: true,
    payment: (data, actions) => {
      console.log("PAYMENT: ", this.selectedOption.price);
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.selectedOption.price, currency: "USD" } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then(payment => {
        //Do something when payment is successful.
        console.log("PAYMENT: ", payment);
        this.userTransactionProvider
          .addTransaction(payment, this.selectedOption, this.user)
          .then(res => {
            this.userProvider
              .updatePremiumSubscription(this.selectedOption)
              .then(res => {
                let alert = this.alertCtrl.create({
                  title: "Congratulations!",
                  subTitle:
                    "You are now subscribed for " +
                    this.selectedOption.name.toLowerCase() +
                    "! You my now enjoy all of the premium features.",
                  buttons: ["Dismiss"]
                });
                alert.present();
                this.navCtrl.popToRoot();
              });
          });
      });
    }
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private premiumOptionsProvider: PremiumSubscriptionOptionsProvider,
    private alertCtrl: AlertController,
    private userProvider: UserProvider,
    private userTransactionProvider: UserTransactionProvider,
    private db: AngularFireDatabase,
    private iap: InAppPurchase,
    private plt: Platform,
    private toastCtrl: ToastController
  ) {
    this.db.list("/userTransaction").remove();
    this.getOptions();

    if (plt.is("core") || plt.is("mobileweb")) {
      this.isMobileApp = false;
    } else {
      this.isMobileApp = true;
    }

    this.plt.ready().then(() => {
      this.iap
        .getProducts([PREMIUM_1_MONTH, PREMIUM_6_MONTH, PREMIUM_1_YEAR])
        .then(products => {
          this.inAppProducts = products;
          let alert = this.alertCtrl.create({
            title: "PRODUCTS",
            subTitle: JSON.stringify(products),
            buttons: ["Ok"]
          });
        })
        .catch(err => {
          let alert = this.alertCtrl.create({
            title: "ERROR RETRIEVING PRODUCTS",
            subTitle: JSON.stringify(err),
            buttons: ["Ok"]
          });
        });
    });
  }

  getOptions() {
    this.premiumOptionsProvider.getOptions().then(res => {
      this.options = res;
      this.selectedOptionId =
        this.options.length > 0 ? this.options[0].id : null;
      this.updateSelectedOption();
    });
  }

  ionViewWillEnter() {
    this.userProvider.getCurrentUser().subscribe(res => {
      this.user = res;
    });
    this.getOptions();
    if (this.cordova) {
    } else {
      this.loadWeb();
    }
  }

  ionViewDidLoad() {
    // this.userProvider.updatePremiumSubscription(this.selectedOption);
  }

  loadWeb() {
    if (!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Button.render(this.paypalConfig, "#paypal-checkout-btn");
        this.paypalLoad = false;
      });
    }
  }

  addPaypalScript() {
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement("script");
      scripttagElement.src = "https://www.paypalobjects.com/api/checkout.js";
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }

  changeSelectedOption(option: IPremiumOption) {
    if (this.isMobileApp) {
      
      let toast = this.toastCtrl.create({
        message: 'User Purchases == '+ option.inAppId,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();

      this.subscribe(option.inAppId);
    } else {
      let optionId = option.id;

      this.options.forEach(option => {
        option.selected = false;
      });

      this.selectedOption = this.options.find(x => x.id === optionId);
      this.options.find(x => x.id === optionId).selected = true;
    }
  }

  buy(product) {
    this.iap.buy(product).then(data => {
      let alert = this.alertCtrl.create({
        title: "DATA",
        subTitle: JSON.stringify(data),
        buttons: ["Ok"]
      });

      alert.present();
      this.enableItems(product);
    })
    .catch( err => {
      let alert = this.alertCtrl.create({
        title: "ERROR",
        subTitle: JSON.stringify(err),
        buttons: ["Ok"]
      });

      alert.present();
    });
  }

  subscribe(product) {
    this.iap.subscribe(product).then(data => {
      let alert = this.alertCtrl.create({
        title: "SUBSCRIBE",
        subTitle: JSON.stringify(data),
        buttons: ["Ok"]
      });


      alert.present();
      this.enableItems(product);
    })
    .catch( err => {
      let alert = this.alertCtrl.create({
        title: "SUBSCRIBE ERROR",
        subTitle: JSON.stringify(err),
        buttons: ["Ok"]
      });

      alert.present();
    });
  }

  enableItems(id) {
    // Normally store these settings/purchases inside your app or server!
    if (
      id === PREMIUM_1_MONTH ||
      id === PREMIUM_6_MONTH ||
      id === PREMIUM_1_YEAR
    ) {
      this.isPremium = true;
      // TODO add premium provider
    }
  }

  updateSelectedOption() {
    this.selectedOption = this.options.find(x => x.id == this.selectedOptionId);
    if (this.selectedOption === undefined)
      this.selectedOption = {
        id: 0,
        name: "",
        description: "",
        price: 0,
        savePercentage: 0,
        selected: false,
        duration: 0
      };
  }
}
