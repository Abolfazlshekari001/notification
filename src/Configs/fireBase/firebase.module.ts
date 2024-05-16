// firebase-admin.module.ts
import { Global, Module } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { FirebaseService } from './firebase.service';
dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});
@Global() 
@Module({
  providers: [
    FirebaseService
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
export class FirebaseAdminModule {}
