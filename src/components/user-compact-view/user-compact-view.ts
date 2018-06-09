import { Component, Input } from '@angular/core';
import { IUser } from '../../models/IUser';
import { UserProvider } from '../../providers/user/user';
import { env } from '../../app/env';
import { NavController } from 'ionic-angular';
import moment from 'moment';

/**
 * Generated class for the UserCompactViewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'user-compact-view',
  templateUrl: 'user-compact-view.html'
})
export class UserCompactViewComponent {
  defaultUserImage = env.DEFAULT.userImagePlaceholder;
  details = '';

  _user: IUser;

  get user(): IUser {
    return this._user;
  }

  @Input()
  set user(value: IUser) {
    this._user = value;
    this.formatDetails();
  }

  constructor(
    private userProvider: UserProvider,
    private navCtrl: NavController
  ) {}

  navigateToProfile() {
    this.navCtrl.push('ProfilePage', { userId: this._user.id });
  }

  calculateAge() {
    return moment().diff(this._user.birthdate, 'years');
  }

  formatDetails() {
    let details = [];

    details.push(this.calculateAge());
    details.push(this._user.state);

    details = details.filter(detail => !!detail);

    this.details = details.join(', ');
  }
}
