import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendNotificationController } from './send-notification.controller';
import { SendNotificationService } from './send-notification.service';
import { sendForMultipleDeviceCommandHandler } from './commands/SendMultipleForDevice/SendMultipleForDevice.command-handler';
import { SendDataCommandHandler } from './commands/SendDataForNotification/SendData.command-handler';
import { FirebaseAdminModule } from 'src/config/fireBase/firebase.module';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { TypeOrmConfig } from 'src/config/TypeOrm-Confing/TypeOrm.Config';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { System } from 'src/domains/Entities/System.entity';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';
import { SendToMultipleTopicsCommandHandler } from './commands/SendForMultiple/sendForMultiple.command-handler';
import { sendForOnePersonCommandHandler } from './commands/sendForOnePerson/SendForOnePerson.command-handler';
import { sendForMultipleUserCommandHandler } from './commands/sendforMultiUser/sendforMultiUser.command-handler';
export const CommandHandlers = [
  sendForOnePersonCommandHandler,
  SendToMultipleTopicsCommandHandler,
  sendForMultipleDeviceCommandHandler,
  SendDataCommandHandler,
  sendForMultipleUserCommandHandler,
];
export const QueriesHandlers = [];
export const EventHandlers = [];
@Module({
  imports: [
    FirebaseAdminModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([System, topicsEntity, DeviceEntity]),
    CqrsModule,
  ],

  controllers: [SendNotificationController],
  providers: [
    FirebaseService,
    SendNotificationService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],

  exports: [
    FirebaseService,
    SendNotificationService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],
})
export class SendNotificationModule {}
