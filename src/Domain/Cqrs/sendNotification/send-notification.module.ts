import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/Configs/TypeOrm-Confing/TypeOrm.Config';
import { System } from 'src/Domain/Entities/System.entity';
import { SendNotificationController } from './send-notification.controller';
import { SendNotificationService } from './send-notification.service';
import { sendForOnePersonCommandHandler } from './sendForOnePerson/SendForOnePerson.command-handler';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { SendToMultipleTopicsCommandHandler } from './SendForMultiple/sendForMultiple.command-handler';
import { FirebaseAdminModule } from 'src/Configs/fireBase/firebase.module';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
export const CommandHandlers = [
  sendForOnePersonCommandHandler,
  SendToMultipleTopicsCommandHandler,
];
export const QueriesHandlers = [];
export const EventHandlers = [];
@Module({
  imports: [
    FirebaseAdminModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([System, topicsEntity]),
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
