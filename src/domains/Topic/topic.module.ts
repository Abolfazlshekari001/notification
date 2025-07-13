import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { addTopicCommandHandler } from './commands/AddTopic/AddTopic.command-handler';
import { GetAllTopicQueryHandler } from './queries/GetAllTopic/getAllTopic.query-handler';
import { SubscriptionCommandHandler } from './commands/Subescribe/subescribe.command-handler';

import { GetOneTopicQueryHandler } from './queries/GetOneTopic/getOneTopic.query-handler';
import { GetAllSubForTopicQueryHandler } from './queries/GetAllSubForOneTopic/getAllSubForOneTopic.query-handler';
import { TypeOrmConfig } from 'src/config/TypeOrm-Confing/TypeOrm.Config';
import { FirebaseAdminModule } from 'src/config/fireBase/firebase.module';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { SubscriptionEntity } from 'src/domains/Entities/Subscription.entities';
import { System } from 'src/domains/Entities/System.entity';
import { topicsEntity } from 'src/domains/Entities/Topic.entities';
import { deleteTopicCommandHandler } from './commands/DeleteTopic/deleteTopic.command-handler';
import { sendNotificationTopicCommandHandler } from './commands/SendNotificationsTopic.ts/notification-topic.command-handler';
import { unSubscriptionCommandHandler } from './commands/UnSubescribe/unSubescribe.command-handler';
import { updateTopicCommandHandler } from './commands/UpdateTopic/updateTopic.command-handler';
export const CommandHandlers = [
  addTopicCommandHandler,
  deleteTopicCommandHandler,
  updateTopicCommandHandler,
  SubscriptionCommandHandler,
  unSubscriptionCommandHandler,
  sendNotificationTopicCommandHandler,
];
export const QueriesHandlers = [
  GetAllTopicQueryHandler,
  GetAllSubForTopicQueryHandler,
  GetOneTopicQueryHandler,
];
export const EventHandlers = [];
@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([
      topicsEntity,
      System,
      SubscriptionEntity,
      DeviceEntity,
    ]),
    CqrsModule,
    FirebaseAdminModule,
  ],
  controllers: [TopicController],
  providers: [
    FirebaseService,
    TopicService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],
  exports: [
    FirebaseService,
    TopicService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],
})
export class TopicModule {}
