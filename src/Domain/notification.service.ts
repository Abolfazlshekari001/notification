import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { InternalServerError } from 'src/Common/translate/Error.Translate';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';


@Injectable()
export class NotificationService {
  constructor(
  //  private firebaseMessaging:FirebaseService,
  ) {}
  // async sendPushNotification(token: string, payload: admin.messaging.Message) {
  //   try {
  //     const response = await this.firebaseMessaging.messagingService.send({
  //       token,
  //       ...payload
  //     });
  //     console.log('Notification sent successfully:', response);
  //     return response;
  //   } catch (error) {
  //     console.error('Error sending notification:', error);
  //     if (error.status === undefined) {
  //       const formatError = InternalServerError(error.message);
  //       throw new HttpException(formatError, formatError.status_code);
  //     } else {
  //       throw error;
  //     }
  //   }
  // }
  }

  








