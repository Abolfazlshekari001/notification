import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sendForMultipleDeviceCommand } from './SendMultipleForDevice.command';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
import { SendNotificationService } from '../send-notification.service';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { HttpException } from '@nestjs/common';
import { Request_Was_Successful1 } from 'src/Common/translate/Successful.Translate';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { In, IsNull, Repository } from 'typeorm';

@CommandHandler(sendForMultipleDeviceCommand)
export class sendForMultipleDeviceCommandHandler
  implements ICommandHandler<sendForMultipleDeviceCommand>
{
  constructor(
    private readonly notificationService: SendNotificationService,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}
  async execute(command: sendForMultipleDeviceCommand): Promise<any> {
    const { title, message, tokens, system_name, system_password } = command;
    try {
      const existingSystem = await this.notificationService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingToken = await this.deviceRepository.find({
          where: {
            token_Device: In(tokens),
            system: existingSystem,
            MuteNotification: false,
            deletedAt: IsNull(),
          },
        });
        if (existingToken) {
          const batches = await this.notificationService.splitIntoBatches(
            tokens,
            500,
          );
          const notificationPromises = batches.map((batch) =>
            this.notificationService.sendNotificationBatch(
              title,
              message,
              batch,
            ),
          );

          const results = await Promise.all(notificationPromises);
          const additional_info = results;
          const result = Request_Was_Successful1(additional_info);
          throw new HttpException(result, result.status_code);
        }else{
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
