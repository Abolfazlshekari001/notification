import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './Domain/notification.module';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './Configs/TypeOrm-Confing/TypeOrm.Config';
import { TokenModule } from './Domain/Cqrs/Token/token.module';
import { TopicModule } from './Domain/Cqrs/Topic/topic.module';
import { FirebaseAdminModule } from './Configs/fireBase/firebase.module';
import { SendNotificationModule } from './Domain/Cqrs/sendNotification/send-notification.module';

dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});
@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    CqrsModule,
    NotificationModule,
    TokenModule,
    FirebaseAdminModule,
     TopicModule,
    SendNotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
