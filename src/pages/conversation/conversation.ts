import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { IUser } from '../../models/IUser';
import { UserProvider } from '../../providers/user/user';
import { ConversationProvider } from '../../providers/conversation/conversation';
import { Subscription } from 'rxjs';
import { IConversationMessage } from '../../models/IConversationMessage';
import firebase from 'firebase';
import moment from 'moment';
import { env } from '../../app/env';
import { FirebaseStorageProvider } from '../../providers/firebase-storage/firebase-storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationProvider } from '../../providers/notification/notification';
import { EmailProvider } from '../../providers/email/email';
import { PremiumSubscriptionProvider } from '../../providers/premium-subscription/premium-subscription';

/**
 * Generated class for the ConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class ConversationPage {
  @ViewChild('chatContainer') chatContainer: Content;

  isMobile: boolean = !!window['cordova'];

  defaultUserImage = env.DEFAULT.userImagePlaceholder;
  recipient: IUser;
  sender: IUser;
  message: string = '';
  messages: IConversationMessage[] = [];
  conversationId: string;
  isRecipientOnline: boolean;
  isRecipientOnlineSubscription: Subscription;

  senderSubscription: Subscription;
  conversationSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public conversationProvider: ConversationProvider,
    public dbStorage: FirebaseStorageProvider,
    public db: AngularFireDatabase,
    public notificationProvider: NotificationProvider,
    private emailProvider: EmailProvider,
    private premiumSubscriptionProvider: PremiumSubscriptionProvider
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversationPage');

    this.initUsers();
    this.loadConversation();
    this.conversationProvider.clearUnread(this.sender.id, this.conversationId);
    this.isRecipientOnlineSubscription = this.db.object(`presence/${this.recipient.id}`).valueChanges().subscribe((isOnline: any) => {
      this.isRecipientOnline = !!isOnline;
    });
    this.notificationProvider.removeMessageNotificationToUser(this.recipient.id);
  }

  ionViewDidLeave() {
    this.conversationProvider.clearUnread(this.sender.id, this.conversationId);
    if (this.isRecipientOnline) {
      this.notificationProvider.removeMessageNotificationToUser(this.recipient.id);
    }

    if (this.senderSubscription) this.senderSubscription.unsubscribe();
    if (this.conversationSubscription)
      this.conversationSubscription.unsubscribe();
    if (this.isRecipientOnlineSubscription) this.isRecipientOnlineSubscription.unsubscribe();
  }

  initUsers() {
    this.recipient = this.navParams.data.recipient;
    this.userProvider.getCurrentUser().subscribe(user => {
      this.sender = user;
    });
  }

  loadConversation() {
    this.conversationId = this.conversationProvider.getConversationId(
      this.recipient.id
    );
    this.conversationProvider.clearUnread(this.sender.id, this.conversationId);

    this.conversationSubscription = this.conversationProvider
      .getConversation(this.recipient.id)
      .subscribe((messages: IConversationMessage[]) => {
        let mappedMessages: any = messages.map(message => {
          let mappedMessage = {
            user: {},
            payload: message.payload,
            timestamp: message.timestamp,
            file: message.file,
            isSender: false
          };

          if (message.userId === this.sender.id) {
            mappedMessage.user = this.sender;
            mappedMessage.isSender = true;
          } else {
            mappedMessage.user = this.recipient;
          }

          return mappedMessage;
        });
        console.log('messages:', mappedMessages);
        this.messages = mappedMessages;
        this.scrollToBottom();
      });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer._scroll) {
        this.chatContainer.scrollToBottom(300);
      }
    });
  }

  formatTime(timestamp: number) {
    return moment(timestamp).fromNow();
  }

  sendMessage(message: string = '', fileUrl: string = null) {
    if (!this.premiumSubscriptionProvider.hasSubscription()) {
      this.premiumSubscriptionProvider.presentPremiumModal();
      return;
    }

    this.message = '';

    if (message.trim().length === 0) return;

    let payload: IConversationMessage = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userId: firebase.auth().currentUser.uid,
      file: fileUrl,
      payload: message.trim()
    };

    this.conversationProvider.sendMessage(this.conversationId, payload);

    this.notificationProvider.addMessageNotificationToUser(this.recipient.id);

    // Update your list
    this.conversationProvider.updateUserConversationListDetails(
      this.sender.id,
      this.recipient.id,
      this.conversationId,
      payload,
      false
    );

    // Update recipent's list
    this.conversationProvider.updateUserConversationListDetails(
      this.recipient.id,
      this.sender.id,
      this.conversationId,
      payload,
      true
    );

    if(!this.isRecipientOnline){
      this.emailProvider.emailConversationMessage(this.recipient, this.sender, message);
    }
  }


  uploadImageFromCamera() {
    this.dbStorage
      .uploadImageFromCamera()
      .then(imageData => {
        console.log('received imageData:', imageData);
        this.sendMessage('Uploaded an image', imageData.downloadUrl);
      })
      .catch((err: Error) => {
        console.log('File upload error:', err);
      });
  }

  uploadImageFromGallery() {
    this.dbStorage
      .uploadImageFromGallery()
      .then(imageData => {
        console.log('received imageData:', imageData);
        this.sendMessage('Uploaded an image', imageData.downloadUrl);
      })
      .catch((err: Error) => {
        console.log('File upload error:', err);
      });
  }

  uploadImageFromWebTrigger() {
    let inputElem: any = document.querySelector('#fileElem');
    inputElem.click();
  }

  uploadImageFromWeb(file) {
    if (file.length) {
      this.dbStorage
        .uploadImageFromWeb(file[0])
        .then(imageData => {
          console.log('received imageData:', imageData);
          this.sendMessage('Uploaded an image', imageData.downloadUrl);
        })
        .catch((err: Error) => {
          console.log('File upload error:', err);
        });
    }
  }
}
