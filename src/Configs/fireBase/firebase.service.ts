// // در مرورگر
//  import { initializeApp } from "firebase/app";
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});

@Injectable()
export class FirebaseService {
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
      throw error;
    }
  }

  get messagingService(): admin.messaging.Messaging {
    return this.messaging;
  }
}

// const firebaseConfig = {
//   apiKey: 'AIzaSyAWjugrs9i8ju1rirhbQMVK3SHzYTWjqLg',
//   authDomain: 'notification-simorgh.firebaseapp.com',
//   projectId: 'notification-simorgh',
//   storageBucket: 'notification-simorgh.appspot.com',
//   messagingSenderId: '1072608757972',
//   appId: '1:1072608757972:web:d2d88c7de56d6ba85cd341',
//   measurementId: 'G-5S01NJ2W5Y',
// };

// const app = initializeApp(firebaseConfig);
// // 
//const messaging = messaging(app); 

// //  import { getAnalytics } from "firebase/analytics";
// //  import { getMessaging, getToken } from "firebase/messaging";
// // import * as admin from 'firebase-admin';

//  const firebaseConfig1 = {
//    apiKey: "AIzaSyAWjugrs9i8ju1rirhbQMVK3SHzYTWjqLg",
//    authDomain: "notification-simorgh.firebaseapp.com",
//    projectId: "notification-simorgh",
//    storageBucket: "notification-simorgh.appspot.com",
//    messagingSenderId: "1072608757972",
//    appId: "1:1072608757972:web:d2d88c7de56d6ba85cd341",
//   measurementId: "G-5S01NJ2W5Y"
//  };

// const app1 = initializeApp(firebaseConfig1);

//  const analytics = getAnalytics(app);
// function requestPermissionAndGetToken() {
//   Notification.requestPermission().then(permission => {
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//       getToken(messaging, { vapidKey: 'BJjm1yHmYUI65jIMN2VJ2TLHqHjKvpQTJQlkPIA_GsjQ53Ml8Z6BtmrKltZFoaDPR4HdGNpJy02OhZ36z0R6g1A' }).then((currentToken) => {
//         if (currentToken) {
//           console.log('FCM Token:', currentToken);
//           // ارسال توکن به سرور NestJS
//         } else {
//           console.log('No registration token available. Request permission to generate one.');
//         }
//       }).catch((err) => {
//         console.error('An error occurred while retrieving token. ', err);
//       });
//     }
//   });
// }
// console.log('122221212121 :>> ', requestPermissionAndGetToken);

// const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
// export const FIREBASE_ADMIN_PROVIDER = {
//     provide: 'FIREBASE_ADMIN',
//     useFactory: async () => {
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount)
//       });
//       return admin.messaging();
//     }
//   };

// async getDeviceToken(deviceId: 'my_test_device_id'): Promise<string> {

//   const legacyServerKey =
//     'BJjm1yHmYUI65jIMN2VJ2TLHqHjKvpQTJQlkPIA_GsjQ53Ml8Z6BtmrKltZFoaDPR4HdGNpJy02OhZ36z0R6g1A';
//   const url = 'https://iid.googleapis.com/iid/v1:batchImport';

//   const data = {
//     application: '1:1072608757972:web:d2d88c7de56d6ba85cd341',
//     sandbox: true, // true for testing, false for production
//     apns_tokens: [],
//     registration_ids: [deviceId],
//   };

//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `key=${legacyServerKey}`,
//   };

//   try {
//     const response = await axios.post(url, data, { headers });
//     const token = response.data.registration_ids[0];
//     const token1 = await this.getDeviceToken(deviceId);
//     console.log('Device Token:', token1);
//     return token;
//   } catch (error) {
//     console.error('Error getting device token:', error);
//     throw error;
///  }
//}
