import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/Configs/TypeOrm-Confing/TypeOrm.Config';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { saveTokensCommandHandler } from './SaveToken/saveToken.command-handler';
import { deleteTokensCommandHandler } from './DeletedToken/deleteToken.command-handler';
import { GetAllTokenQueryHandler } from './queries/getALLtoken/getAllToken.query-handler';
import { System } from 'src/Domain/Entities/System.entity';
import { GetOneTokenQueryHandler } from './queries/getOneToken/getOneToken.query-handler';
import { updateTokensCommandHandler } from './UpdateToken/updateToken.command-handler';
import { MuteNotificationCommandHandler } from './settings/setting.command-handler';
export const CommandHandlers = [
  saveTokensCommandHandler,
  deleteTokensCommandHandler,
  updateTokensCommandHandler,
  MuteNotificationCommandHandler
];
export const QueriesHandlers = [
  GetAllTokenQueryHandler,
  GetOneTokenQueryHandler,
  
];
export const EventHandlers = [];
@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([DeviceEntity, System]),
    CqrsModule,
  ],
  controllers: [TokenController],
  providers: [
    TokenService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],
  exports: [
    TokenService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueriesHandlers,
  ],
})
export class TokenModule {}
