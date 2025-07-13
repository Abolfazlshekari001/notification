// firebase-admin.module.ts
import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '../TypeOrm-Confing/TypeOrm.Config';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([DeviceEntity]),
  ],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseAdminModule {}
