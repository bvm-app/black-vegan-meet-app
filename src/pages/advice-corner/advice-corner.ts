import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { YoutubeProvider } from '../../providers/youtube/youtube';

/**
 * Generated class for the AdviceCornerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-advice-corner',
  templateUrl: 'advice-corner.html',
})
export class AdviceCornerPage {

  videos: any = [];
  isMobile: boolean = !!window['cordova'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private youtubeProvider: YoutubeProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdviceCornerPage');

    this.getVideos();
  }

  openVideo(video) {
    window.open('https://www.youtube.com/watch?v=' + video.id.videoId);
  }

  getVideos() {
    this.youtubeProvider.searchVideos('dating_advice').then(res => {
      res.subscribe(data => {
        data.items.forEach(element => {
          this.videos.push(element);
        });
      });
    });
  }

}
