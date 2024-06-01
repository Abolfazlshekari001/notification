import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/Configs/TypeOrm-Confing/TypeOrm.Config';
import { SubscriptionEntity } from 'src/Domain/Entities/Subscription.entities';
import { System } from 'src/Domain/Entities/System.entity';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { addTopicCommandHandler } from './AddTopic/AddTopic.command-handler';
import { deleteTopicCommandHandler } from './DeleteTopic/deleteTopic.command-handler';
import { updateTopicCommandHandler } from './UpdateTopic/updateTopic.command-handler';
import { GetAllTopicQueryHandler } from './queries/GetAllTopic/getAllTopic.query-handler';
import { SubscriptionCommandHandler } from './Subescribe/subescribe.command-handler';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { unSubscriptionCommandHandler } from './UnSubescribe/unSubescribe.command-handler';
import { sendNotificationTopicCommandHandler } from './SendNotificationsTopic.ts/notification-topic.command-handler';
import { FirebaseAdminModule } from 'src/Configs/fireBase/firebase.module';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
import { GetOneTopicQueryHandler } from './queries/GetOneTopic/getOneTopic.query-handler';
import { GetAllSubForTopicQueryHandler } from './queries/GetAllSubForOneTopic/getAllSubForOneTopic.query-handler';
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
  GetOneTopicQueryHandler
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
