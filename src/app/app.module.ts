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

// Services/Providers
import { FirebaseStorageProvider } from '../providers/firebase-storage/firebase-storage';
import { EventProvider } from '../providers/event/event';
import { EnumProvider } from '../providers/enum/enum';

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
import { ManageEventsPageModule } from '../pages/manage-events/manage-events.module';
import { CreateEventPageModule } from '../pages/create-event/create-event.module';
import { CreateEventPage } from '../pages/create-event/create-event';
@NgModule({
  declarations: [MyApp, HomePage],
  imports: [
    BrowserModule,
    ComponentsModule,
    LazyLoadImageModule,
    IonicModule.forRoot(MyApp),
    LoginPageModule,
    AngularFireModule.initializeApp(env.FIREBASE),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RegisterPageModule,
    LoginPageModule,
    StartPageModule,
    CreateEventPageModule,
    ManageEventsPageModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    FileChooser,
    FilePath,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AngularFireDatabase,
    FirebaseStorageProvider,
    UserProvider,
    EventProvider,
    Geolocation,
    EnumProvider,
  ]
})
export class AppModule {
  constructor() {
    if (window.location.href.includes('#')) {
      window.location.href = window.location.origin;
    }
  }
}
