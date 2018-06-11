import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ActionSheetController,
  AlertController
} from 'ionic-angular';
import firebase from 'firebase';
import { DragulaService } from 'ng2-dragula';
import { env } from '../../app/env';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';

/**
 * Generated class for the EditPhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-photos',
  templateUrl: 'edit-photos.html'
})
export class EditPhotosPage {
  cordova = window['cordova'];
  currentLoggedInUserId: string;
  defaultImagePlaceholder = env.DEFAULT.icons.Logo;

  userImages: any[] = [];
  userImagesSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dragulaService: DragulaService,
    public db: AngularFireDatabase,
    public dbStorage: FirebaseStorageProvider,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    this.dragulaService.drag.subscribe(val => {
      console.log('Is dragging:', val);
    });

    this.dragulaService.drop.subscribe(val => {
      console.log('Is dropped:', val);
      this.onDrop(val[2]);
    });
  }

  ionViewWillEnter() {
    this.currentLoggedInUserId = firebase.auth().currentUser.uid;
    console.log('ionViewWillEnter EditPhotosPage');

    this.userImagesSubscription = this.db
      .list(`userData/${this.currentLoggedInUserId}/images`)
      .valueChanges()
      .subscribe(images => {
        this.userImages = images || [];
      });
  }

  ionViewDidLeave() {
    if (this.userImagesSubscription) this.userImagesSubscription.unsubscribe();
  }

  removeImage(toBeRemovedImage) {
    let alert = this.alertCtrl.create({
      title: 'Remove image',
      message: 'Are you sure you want to remove this image?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.userImages = this.userImages.filter(image => image !== toBeRemovedImage);
          }
        }
      ]
    });
    alert.present();
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Upload image',
      buttons: [
        {
          text: 'Take photo',
          handler: () => {
            this.dbStorage.uploadImageFromCamera().then(imageData => {
              this.userImages.push(imageData.downloadUrl);
            });
          }
        },
        {
          text: 'Upload from photo library',
          handler: () => {
            this.dbStorage.uploadImageFromGallery().then(imageData => {
              this.userImages.push(imageData.downloadUrl);
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  addPhoto() {
    if (this.cordova) {
      this.presentActionSheet();
    } else {
      let inputElem: any = document.querySelector('#fileElem');
      inputElem.click();
    }
  }

  uploadImageFromWeb(file) {
    if (file.length) {
      this.dbStorage
        .uploadImageFromWeb(file[0])
        .then(imageData => {
          this.userImages.push(imageData.downloadUrl);
        })
        .catch((err: Error) => {
          console.log('File upload error:', err.message);
        });
    }
  }

  updateUserPhotos() {
    this.db
      .object(`userData/${this.currentLoggedInUserId}/images`)
      .set(this.userImages)
      .then(() => {
        let imageValue = (this.userImages.length) ? this.userImages[0]: null;

        return this.db
          .object(`userData/${this.currentLoggedInUserId}/profilePictureUrl`)
          .set(imageValue)
          .then(() => {
            this.presentToast('Successfully updated images');
          })
          .catch(() => {
            this.presentToast('Oops! Something went wrong...');
          });
      })
      .catch(() => {
        this.presentToast('Oops! Something went wrong...');
      });
  }

  presentToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
      })
      .present();
  }

  // Taken from:
  // http://masteringionic.com/blog/2017-12-15-creating-a-sortable-list-with-ionic-and-dragula/

  /**
   * Extract the reordered list value after the dragged list item
   * has been dropped into its desired location
   *
   * @public
   * @method onDrop
   * @return {None}
   */
  onDrop(val: any): void {
    console.log('val on drop:', val.childNodes);
    // Reset the items array
    this.userImages = [];

    // Iterate through the retrieved list data
    val.childNodes.forEach(item => {
      console.log('item id:', item.id);
      // Do we have data?
      if (item.id) {
        // Re-populate the items array with new list order
        this.userImages.push(item.id);
      }
    });

    // Here we console log the directory structure of the array
    // but we could add functionality to save the re-populated
    // array items (and new list order) to a database for 'session'
    //persistence
    console.dir(this.userImages);
  }
}
