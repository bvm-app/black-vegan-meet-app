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
        price: 83.88,
        savePercentage: ((191.88 - (83.88 * 1)) / 191.88) * 100,
        selected: true
      },
      {
        id: 2,
        name: 'Six Months',
        description: '6 month subscription $9.99 per month ($54.94 billed one time payment)',
        price: 54.84,
        savePercentage: ((191.88 - (54.84 * 2)) / 191.88) * 100,
        selected: false
      },
      {
        id: 3,
        name: 'Three Months',
        description: '3 month $12.99 ($38.97 billed one time payment)',
        price: 38.97,
        savePercentage: ((191.88 - (38.97 * 4)) / 191.88) * 100,
        selected: false
      },
      {
        id: 4,
        name: 'One Month',
        description: '1 month only $15.99 per month ($15.99 billed one time payment)',
        price: 15.99,
        savePercentage: ((191.88 - (15.99 * 12)) / 191.88) * 100,
        selected: false
      }
    );
  }

  getOptions() : Promise<IPremiumOption[]> {
    return new Promise(resolve => {
      resolve(this.options);
    });
  }
}
