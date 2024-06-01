import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/Common/translate/Error.Translate';

dotenv.config({ path: `${process.env.NODE_ENV}.env`, });

@Injectable()
export class FirebaseService {
  [x: string]: any;
  private messaging: admin.messaging.Messaging;

  constructor() {
    this.initializeFirebase();
  }

  private async initializeFirebase() {
    try {
      if (admin.apps.length === 0) {
        const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
        if (!serviceAccountPath) {
          throw new Error(
            'FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set',
          );
        }
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
      this.messaging = admin.messaging();
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }

// async logEvent(eventData: any) {
//   try {
//     const analytics = admin.analytics();
//     const res = await analytics.logEvent(eventData);
//     console.log('Event logged successfully:', res);
//   } catch (err) {
//     console.error('Error logging event:', err);
//   }
// }
  async sendNotification(token: string, message: any): Promise<any> {
    try {
      const response = await this.messaging.send({
        token,
        notification: message.notification,
        data: message.data,
      });
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);

      if (
        error.errorInfo.code === 'messaging/registration-token-not-registered'
      ) {
        console.log(
          `Token ${token} is not registered. Deleting from database.`,
        );
      }

      throw error;
    }
  }

  async sendMulticast(payload: {
    notification: { title: string; body: string };
    tokens: string[];
  }) {
    return admin.messaging().sendMulticast(payload);
  }

  async sendData(token: string, data: any): Promise<any> {
    try {
      const response = await this.messaging.sendToDevice(token, { data });
      console.log('Successfully sent data:', response);
      return response;
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }

  get messagingService(): admin.messaging.Messaging {
    try {
      let response = this.messaging;
      return response;
    } catch (error) {
      throw error;
    }
  }


}
