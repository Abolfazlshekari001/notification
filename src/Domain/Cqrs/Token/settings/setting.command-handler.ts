import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { IsNull, Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { Request_Was_Successful } from 'src/Common/translate/Successful.Translate';
import { TokenService } from '../token.service';
import { MuteNotificationCommand } from './setting.command';
@CommandHandler(MuteNotificationCommand)
export class MuteNotificationCommandHandler
  implements ICommandHandler<MuteNotificationCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly tokenService: TokenService,
  ) {}
  async execute(command: MuteNotificationCommand): Promise<any> {
    const { id_token, system_name, system_password } = command;
    const { Mute } = command.req;
    try {
      const existingSystem = await this.tokenService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const result = await this.deviceRepository.findOne({
          where: {
            id: id_token,
            deletedAt: IsNull(),
          },
        });
        if (result) {
          result.MuteNotification = Mute;
          await this.deviceRepository.save(result);
          throw new HttpException(
            Request_Was_Successful,
            Request_Was_Successful.status_code,
          );
        } else {
          const NoContentErr = NoContent(
            'درخواست حاوی پاسخ نمیباشد',
            'The response is empty ',
          );
          throw new HttpException(NoContentErr, NoContentErr.status_code);
        }
      } else {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else {
        throw error;
      }
    }
  }
}
