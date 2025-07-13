import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/TypeOrm-Confing/TypeOrm.Config';
import { System } from '../Entities/System.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AddSystemCommandCommandHandler } from './cqrs/commands/addSystem/addSystem.command-handler';

export const CommandHandlers = [AddSystemCommandCommandHandler];
export const QueriesHandlers = [];

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    TypeOrmModule.forFeature([System]),
    CqrsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, ...CommandHandlers, ...QueriesHandlers],
  exports: [AdminService, ...CommandHandlers, ...QueriesHandlers],
})
export class AdminModule {}
