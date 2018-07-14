import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  public emailReport(reported: IUser, reporter: IUser, reason: any) {

    let message = `Report from: ${reporter.username} <${reporter.email}> (${reporter.id})<br>
    Reported: ${reported.username} <${reported.email}> (${reported.id})<br><br>
    -- Details of the report -- <br>
    <div style="padding:10px;">
    Reason: ${reason.reason} <br>
    Suggesed course of action: ${reason.suggestedAction} <br>
    Specific details: ${reason.specificDetails}
    </div>
    `;

    // let recipient = 'grphxprod@gmail.com';
    let recipient = 'info@blackveganmeet.com';
    let fromName = 'BVM User Report';
    let subject = `User Report From ${reporter.email}`
    this.sendEmail(recipient, message, subject, fromName);
  }

  public emailConversationMessage(recipient: IUser, sender: IUser, message: string) {

    let emailMessage = `Message from: ${sender.username}<br><br>
    -- Message Content -- <br>
    <div style="padding:10px;">
    ${message.trim()}
    </div>
    `;

    // let recipient = 'grphxprod@gmail.com';
    let fromName = 'BVM';
    let subject = `${sender.firstName} Sent a Message`
    this.sendEmail(recipient.email, emailMessage, subject, fromName);
  }


  private sendEmail(toEmail: string, message: string, subject: string = '<no subject>', fromName: string = 'BVM') {
    //TODO store in db
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
