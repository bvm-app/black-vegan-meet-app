import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
import { Http, RequestOptions, Headers } from '@angular/http';
import { IUser } from '../../models/IUser';

/*
  Generated class for the EmailProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmailProvider {

  constructor(private http: Http) { }

  public emailReport(reported: string, reporter: string, reason: string) {
    let message = `Report from: ${reporter}<br>
    Reported: ${reported}<br>
    Reason: ${reason}`;

    let recipient = 'grphxprod@gmail.com';
    let fromName = 'BVM User Report';
    let subject = `User Report From ${reporter}`
    this.sendEmail(recipient, message, subject, fromName);
  }

  private sendEmail(toEmail: string, message: string, subject: string = '<no subject>', fromName: string = 'BVM') {
    //TODO
    let api_key = 'cda1d1cc5fdb5bb23383640e1074f4fa-e44cc7c1-18566e03';
    let DOMAIN = 'sandboxbe671af25f684657a58298a02816c725.mailgun.org';

    let data = {
      from: `${fromName} <no-reply@${DOMAIN}>`,
      to: toEmail,
      subject: subject,
      html: message
    };

    let bodyString: string = Object.keys(data)
      .map(x => `${x}=${data[x]}`)
      .join('&');

    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa('api:' + api_key));
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let corsUrl = 'https://cors-anywhere.herokuapp.com/';
    let url = `${corsUrl}https://api.mailgun.net/v3/${DOMAIN}/messages`;

    this.http.post(url, bodyString, new RequestOptions({ headers: headers }))
      .subscribe(success => { }, error => {
        console.error("ERROR", error);
      })
  }
}
