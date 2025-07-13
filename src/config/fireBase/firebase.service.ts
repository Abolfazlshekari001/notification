import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { HttpException, Injectable } from '@nestjs/common';
import { InternalServerError } from 'src/Common/translate/Error.Translate';

dotenv.config({ path: `${process.env.NODE_ENV}.env` });

@Injectable()
export class FirebaseService {
  private appsMap = new Map<string, admin.app.App>();
  private defaultServiceAccountPath: string =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  private getAppKeyFromPath(serviceAccountPath: string): string {
    return serviceAccountPath.split('/').pop();
  }

  private async getMessagingInstance(
    serviceAccountPath: string,
  ): Promise<admin.messaging.Messaging> {
    const appKey = this.getAppKeyFromPath(serviceAccountPath);

    if (!this.appsMap.has(appKey)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require(serviceAccountPath);
      const app = admin.initializeApp(
        {
          credential: admin.credential.cert(serviceAccount),
        },
        appKey,
      );
      this.appsMap.set(appKey, app);
    }

    const app = this.appsMap.get(appKey);
    return app.messaging();
  }

  async sendNotification(
    token: string,
    message: any,
    serviceAccountPath: string,
  ): Promise<any> {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const response = await messaging.send({
        token,
        notification: message.notification,
        data: message.data,
      });
      return response;
    } catch (error) {
      if (
        error.errorInfo &&
        error.errorInfo.code === 'messaging/registration-token-not-registered'
      ) {
        return {
          errorCode: 'messaging/registration-token-not-registered',
          token: token,
        };
      }
      throw error;
    }
  }

  async sendMulticast(
    payload: {
      notification: { title: string; body: string };
      tokens: string[];
    },
    serviceAccountPath: string,
  ) {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const response = await messaging.sendEachForMulticast(payload);
      response.responses.forEach((res, index) => {
        if (!res.success) {
          console.error(
            `❌ Failed to send to token[${index}]: ${payload.tokens[index]}`,
            res.error?.message || res.error,
          );
        } else {
          console.log(
            `✅ Successfully sent to token[${index}]: ${payload.tokens[index]}`,
            res.messageId,
          );
        }
      });
      return response;
    } catch (error) {
      console.error('Error sending multicast message:', error);
      throw error;
    }
  }

  async sendData(
    token: string,
    data: any,
    serviceAccountPath: string,
  ): Promise<any> {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const payload = {
        data: data,
        token: token,
      };
      const response = await messaging.send(payload);
      return response;
    } catch (error) {
      console.error('Error sending data:', error);
      throw new HttpException(InternalServerError(error.message), 500);
    }
  }

  async sendToTopic(
    topic: string,
    message: any,
    serviceAccountPath: string,
  ): Promise<any> {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const payload = {
        topic: topic,
        notification: message.notification,
        data: message.data,
      };
      const response = await messaging.send(payload);
      return response;
    } catch (error) {
      console.error(`Error sending notification to topic ${topic}:`, error);
      throw error;
    }
  }

  async sendToTopics(
    topics: string[],
    message: any,
    serviceAccountPath: string,
  ): Promise<any> {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const sendPromises = topics.map(async (topic) => {
        const payload = {
          topic: topic,
          notification: message.notification,
          data: message.data,
        };
        const response = await messaging.send(payload);
        return response;
      });

      const results = await Promise.all(sendPromises);
      return results;
    } catch (error) {
      console.error('Error sending notification to topics:', error);
      throw error;
    }
  }

  async sendToCondition(
    condition: string,
    message: any,
    serviceAccountPath: string,
  ): Promise<{ success: boolean; message: string; response: string }> {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const payload: any = {
        notification: message.notification,
      };
      if (message.data) {
        payload.data = message.data;
      }
      const response = await messaging.send({
        condition: condition,
        notification: message.notification,
        data: message.data,
      });
      return {
        success: true,
        message: 'Notification sent successfully',
        response: response,
      };
    } catch (error) {
      console.error('Error sending notification to condition:', error);
      throw new Error(
        `Unexpected error sending notification: ${error.message}`,
      );
    }
  }

  async getMessagingService(
    serviceAccountPath?: string,
  ): Promise<admin.messaging.Messaging> {
    const pathToUse = serviceAccountPath || this.defaultServiceAccountPath;
    return await this.getMessagingInstance(pathToUse);
  }

  async subscribeToTopic(
    tokens: string[],
    topic: string,
    serviceAccountPath: string,
  ): Promise<any> {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const response = await messaging.subscribeToTopic(tokens, topic);
      console.log('Successfully subscribed to topic:', response);
      return response;
    } catch (error) {
      console.log('Error subscribing to topic:', error);
      throw error;
    }
  }

  async unsubscribeFromTopic(
    tokens: string[],
    topic: string,
    serviceAccountPath: string,
  ): Promise<any> {
    try {
      const messaging = await this.getMessagingInstance(serviceAccountPath);
      const response = await messaging.unsubscribeFromTopic(tokens, topic);
      console.log('Successfully unsubscribed from topic:', response);
      return response;
    } catch (error) {
      console.log('Error unsubscribing from topic:', error);
      throw error;
    }
  }
}
