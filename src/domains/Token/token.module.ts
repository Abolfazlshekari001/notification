import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { deleteTokensCommandHandler } from './commands/DeletedToken/deleteToken.command-handler';
import { GetAllTokenQueryHandler } from './queries/getALLtoken/getAllToken.query-handler';
import { GetOneTokenQueryHandler } from './queries/getOneToken/getOneToken.query-handler';
import { TypeOrmConfig } from 'src/config/TypeOrm-Confing/TypeOrm.Config';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { System } from 'src/domains/Entities/System.entity';
import { saveTokensCommandHandler } from './commands/SaveToken/saveToken.command-handler';
import { MuteNotificationCommandHandler } from './commands/settings/setting.command-handler';
import { updateTokensCommandHandler } from './commands/UpdateToken/updateToken.command-handler';
import { GetATokenUserQueryHandler } from './queries/getTokenUser/getTokenUser.query-handler';
import { DeleteTokensByUserIdCommandHandler } from './commands/deleteToken-by-userId/deleteToken-by-userId.command-handler';
export const CommandHandlers = [
  saveTokensCommandHandler,
  deleteTokensCommandHandler,
  updateTokensCommandHandler,
  MuteNotificationCommandHandler,
  DeleteTokensByUserIdCommandHandler,
];
export const QueriesHandlers = [
  GetAllTokenQueryHandler,
  GetOneTokenQueryHandler,
  GetATokenUserQueryHandler,
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
