import { HttpException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NoContent,
  Unauthorized,
  InternalServerError,
} from 'src/Common/translate/Error.Translate';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { Repository, In, IsNull } from 'typeorm';
import { SendNotificationService } from '../../send-notification.service';
import { sendForMultipleUserCommand } from './sendforMultiUser.command';

@CommandHandler(sendForMultipleUserCommand)
export class sendForMultipleUserCommandHandler
  implements ICommandHandler<sendForMultipleUserCommand>
{
  constructor(
    private readonly notificationService: SendNotificationService,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}
  async execute(command: sendForMultipleUserCommand): Promise<any> {
    const { title, message, userIds, system_name, system_password } =
      command.body;
    try {
      const existingSystem = await this.notificationService.findSystem(
        system_name,
        system_password,
      );
      if (existingSystem) {
        const existingToken = await this.deviceRepository.find({
          where: {
            userId: In(userIds),
            system: existingSystem,
            MuteNotification: false,
            deletedAt: IsNull(),
          },
        });
        const tokens = existingToken.map((tokent) => tokent.token_Device);
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
              existingSystem.firebaseServiceAccountPath,
            ),
          );

          const results = await Promise.all(notificationPromises);
          // if (results.error) {
          //   console.log(results.error);
          // }
          return results;
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
