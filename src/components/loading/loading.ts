import { Component } from '@angular/core';
import { env } from '../../app/env';

/**
 * Generated class for the LoadingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'loading',
  templateUrl: 'loading.html'
})
export class LoadingComponent {
  logo = env.DEFAULT.icons.Logo;

  constructor() {
    console.log('Hello LoadingComponent Component');
  }

}
