import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendDataCommand } from './SendData.command';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SendNotificationService } from '../../send-notification.service';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { HttpException } from '@nestjs/common';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';

@CommandHandler(SendDataCommand)
export class SendDataCommandHandler
  implements ICommandHandler<SendDataCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private firebaseMessaging: FirebaseService,
    private readonly notificationService: SendNotificationService,
  ) {}
  async execute(command: SendDataCommand): Promise<any> {
    const { token, data, system_name, system_password } = command;
    try {
      const existingSystem = await this.notificationService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingToken = await this.deviceRepository.findOne({
          where: {
            token_Device: token,
            system: existingSystem,
            MuteNotification: false,
            deletedAt: IsNull(),
          },
        });
        if (existingToken) {
          const result = await this.firebaseMessaging.sendData(
            token,
            data,
            existingSystem.firebaseServiceAccountPath,
          );
          return result;
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
      console.error('Error sending message:', error);
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
