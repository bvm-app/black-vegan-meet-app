// Angular/Ionic
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';


// Environment configs
import { env } from './env';

// 3rd party
import { AngularFireModule } from 'angularfire2';
import {
  AngularFireDatabaseModule,
  AngularFireDatabase
} from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ElasticModule } from 'ng-elastic';

// Services/Providers
import { FirebaseStorageProvider } from '../providers/firebase-storage/firebase-storage';
import { EventProvider } from '../providers/event/event';
import { EnumProvider } from '../providers/enum/enum';
import { ViewedMeProvider } from '../providers/viewed-me/viewed-me';
import { UserSearchProvider } from '../providers/user-search/user-search';
import { RefineSearchProvider } from '../providers/refine-search/refine-search';


// Components
import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';

// Modules
import { ComponentsModule } from '../components/components.module';
import { LoginPageModule } from '../pages/login/login.module';
import { UserProvider } from '../providers/user/user';
import { RegisterPageModule } from '../pages/register/register.module';
import { StartPageModule } from '../pages/start/start.module';
import { GroceryStoreModalPageModule } from '../pages/grocery-store-modal/grocery-store-modal.module';
import { GroceryStoresProvider } from '../providers/grocery-stores/grocery-stores';
import { GeoLocationProvider } from '../providers/geo-location/geo-location';

import { RefineSearchPageModule } from '../pages/refine-search/refine-search.module';
import { RestaurantsProvider } from '../providers/restaurants/restaurants';
import { RestaurantModalPageModule } from '../pages/restaurant-modal/restaurant-modal.module';
import { RestaurantsPageModule } from '../pages/restaurants/restaurants.module';
import { SwipeProvider } from '../providers/swipe/swipe';
import { ConversationProvider } from '../providers/conversation/conversation';
import { NotificationProvider } from '../providers/notification/notification';
import { YoutubeProvider } from '../providers/youtube/youtube';

import { CreateEventPageModule } from '../pages/create-event/create-event.module';
import { EventModalPageModule } from '../pages/event-modal/event-modal.module';
import { EventDetailPageModule } from '../pages/event-detail/event-detail.module';
import { PaypalProvider } from '../providers/paypal/paypal';
import { PremiumSubscriptionPageModule } from '../pages/premium-subscription/premium-subscription.module';
import { PremiumSubscriptionOptionsProvider } from '../providers/premium-subscription-options/premium-subscription-options';
import { PayPal } from '@ionic-native/paypal';
import { UserTransactionProvider } from '../providers/user-transaction/user-transaction';
import { BlockProvider } from '../providers/block/block';
import { EmailProvider } from '../providers/email/email';
import { HttpModule } from '@angular/http';
import { ForgotPasswordPageModule } from '../pages/forgot-password/forgot-password.module';
import firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [MyApp, HomePage],
  imports: [
    BrowserModule,
    ComponentsModule,
    ElasticModule,
    LazyLoadImageModule,
    IonicModule.forRoot(MyApp),
    LoginPageModule,
    // AngularFireModule,
    AngularFireModule.initializeApp(env.FIREBASE),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RegisterPageModule,
    LoginPageModule,
    StartPageModule,
    HttpClientModule,
    GroceryStoreModalPageModule,
    RefineSearchPageModule,
    RestaurantModalPageModule,
    RestaurantsPageModule,
    CreateEventPageModule,
    EventModalPageModule,
    EventDetailPageModule,
    PremiumSubscriptionPageModule,
    HttpModule,
    ForgotPasswordPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    FileChooser,
    FilePath,
    PayPal,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFireDatabase,
    FirebaseStorageProvider,
    UserProvider,
    Geolocation,
    GroceryStoresProvider,
    GeoLocationProvider,
    UserProvider,
    EventProvider,
    Geolocation,
    EnumProvider,
    ViewedMeProvider,
    UserSearchProvider,
    RefineSearchProvider,
    RestaurantsProvider,
    SwipeProvider,
    ConversationProvider,
    NotificationProvider,
    YoutubeProvider,
    PaypalProvider,
    PremiumSubscriptionOptionsProvider,
    UserTransactionProvider,
    BlockProvider,
    EmailProvider,
    Facebook,
    GooglePlus
  ]
})
export class AppModule {
  constructor() {
    if (window.location.href.includes('#')) {
      window.location.href = window.location.origin;
    }
  }
}
