import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

/*
  Generated class for the YoutubeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class YoutubeProvider {

  apiKey = 'AIzaSyBF1xWdAs59VH8mmF5Nxs03c2MHNrvmvzo';

  constructor(public http: HttpClient, private youtube: YoutubeVideoPlayer) {
  }

  openVideo(videoId: string) {
    this.youtube.openVideo(videoId);
  }

  async searchVideos(searchValue): Promise<any> {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?key=' + this.apiKey + '&q=' + searchValue + '&part=snippet&maxResults=20');
  }
  
  getListVideos(listId) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' + this.apiKey + '&playlistId=' + listId +'&part=snippet,id&maxResults=20')
    .map((res) => {
    })
  }

}
