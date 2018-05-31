import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the FirebaseStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseStorageProvider {
  private currentLoggedInUserId;
  private loader;

  constructor(
    private camera: Camera,
    private toastCtrl: ToastController
  ) {
    console.log('Hello FirebaseStorageProvider Provider');
    this.currentLoggedInUserId = firebase.auth().currentUser.uid;
  }

  uploadImageFromGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    return this.camera.getPicture(options).then(imageData => {
      let image = this.imageDataURItoBlob(
        'data:image/jpeg;base64,' + imageData,
        'image/jpeg'
      );

      return this.uploadImage(image);
    });
  }

  uploadImageFromCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    return this.camera.getPicture(options).then(imageData => {
      let image = this.imageDataURItoBlob(
        'data:image/jpeg;base64,' + imageData,
        'image/jpeg'
      );

      return this.uploadImage(image);
    });
  }

  private imageDataURItoBlob(dataURI, type) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
  }

  private uploadImage(image) {
    if (image) {
      let fileName = `images/${new Date().getTime()}-${
        this.currentLoggedInUserId
      }.jpeg`;
      let uploadTask = firebase
        .storage()
        .ref()
        .child(fileName)
        .put(image, {
          customMetadata: {
            uploadedBy: this.currentLoggedInUserId,
            fileName: fileName,
            blobType: 'image/jpeg'
          }
        });

      this.toastCtrl
        .create({
          message: 'Uploading...',
          duration: 2000,
          position: 'top'
        })
        .present();

      return uploadTask.then(this.onSuccess, this.onError);
    } else {
      return Promise.reject('No image selected');
    }
  }

  private onSuccess = snapshot => {
    console.log('snapshot:', snapshot);
    return {
      downloadUrl: snapshot.downloadURL,
      contentType: snapshot.metadata.contentType,
      fileName: snapshot.metadata.name
    };
  };

  private onError = error => {
    console.log('error', error);
    return error;
  };
}
