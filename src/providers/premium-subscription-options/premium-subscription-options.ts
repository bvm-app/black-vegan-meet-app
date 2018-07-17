import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPremiumOption } from '../../models/IPremiumOption';

/*
  Generated class for the PremiumSubscriptionOptionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PremiumSubscriptionOptionsProvider {

  options: IPremiumOption[] = [];

  constructor(public http: HttpClient) {
    this.options.push(
      {
        id: 1,
        name: 'One Year',
        description: '1 year subscription $6.99 per month ($83.88 billed one time payment)',
        price: 119.88,
        savePercentage: ((191.88 - (83.88 * 1)) / 191.88) * 100,
        selected: true,
        duration: 12,
        inAppId: 'premium_1_year'
      },
      {
        id: 2,
        name: 'Six Months',
        description: '6 month subscription $9.99 per month ($54.94 billed one time payment)',
        price: 77.94,
        savePercentage: ((191.88 - (54.84 * 2)) / 191.88) * 100,
        selected: false,
        duration: 6,
        inAppId: 'premium_6_month'
      },
      {
        id: 3,
        name: 'One Month',
        description: '1 month only $15.99 per month ($15.99 billed one time payment)',
        price: 15.99,
        savePercentage: ((191.88 - (15.99 * 12)) / 191.88) * 100,
        selected: false,
        duration: 1,
        inAppId: 'premium_1_month'
      }
    );
  }

  getOptions() : Promise<IPremiumOption[]> {
    return new Promise(resolve => {
      resolve(this.options);
    });
  }
}
