import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ENV_CREDENTIALS } from '../../app/env-credentials';

/*
  Generated class for the YoutubeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class YoutubeProvider {

  apiKey = ENV_CREDENTIALS.API_KEYS.YOUTUBE;

  constructor(public http: HttpClient) {
  }

  async searchVideos(searchValue): Promise<any> {
    return this.http.get('https://www.googleapis.com/youtube/v3/search?key=' + this.apiKey + '&q=' + searchValue + '&part=snippet&maxResults=50');
  }

  getListVideos(listId) {
    return this.http.get('https://www.googleapis.com/youtube/v3/playlistItems?key=' + this.apiKey + '&playlistId=' + listId +'&part=snippet,id&maxResults=50')
    .map((res) => {
      return res;
    });
  }

}
