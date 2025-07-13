import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAdminModule } from './config/fireBase/firebase.module';
import { TypeOrmConfig } from './config/TypeOrm-Confing/TypeOrm.Config';
import { SendNotificationModule } from './domains/sendNotification/send-notification.module';
import { TokenModule } from './domains/Token/token.module';
import { TopicModule } from './domains/Topic/topic.module';
import { AdminModule } from './domains/admin/admin.module';

dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});
@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    CqrsModule,
    TokenModule,
    FirebaseAdminModule,
    TopicModule,
    SendNotificationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
