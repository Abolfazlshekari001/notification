// firebase-admin.module.ts
import { Global, Module } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { FirebaseService } from './firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { System } from 'src/Domain/Entities/System.entity';
import { TypeOrmConfig } from '../TypeOrm-Confing/TypeOrm.Config';
dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});
@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([DeviceEntity]),
  ],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
export class FirebaseAdminModule {}
