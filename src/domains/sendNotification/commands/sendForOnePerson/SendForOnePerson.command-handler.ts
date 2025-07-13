import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { sendForOnePersonCommand } from './SendForOnePerson.command';
import {
  InternalServerError,
  NoContent,
  Unauthorized,
} from 'src/Common/translate/Error.Translate';
import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { FirebaseService } from 'src/config/fireBase/firebase.service';
import { DeviceEntity } from 'src/domains/Entities/Registered-Devices.entity';
import { SendNotificationService } from '../../send-notification.service';

@CommandHandler(sendForOnePersonCommand)
export class sendForOnePersonCommandHandler
  implements ICommandHandler<sendForOnePersonCommand>
{
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private firebaseMessaging: FirebaseService,
    private readonly notificationService: SendNotificationService,
  ) {}
  async execute(command: sendForOnePersonCommand): Promise<any> {
    const { title, message, token, system_name, system_password } = command;
    try {
      const existingSystem = await this.notificationService.findSystem(
        system_name,
        system_password,
      );
      if (!existingSystem) {
        const unauthorizedErr = Unauthorized(
          'سیستم نامعتبر است',
          'The system is invalid',
        );
        throw new HttpException(unauthorizedErr, unauthorizedErr.status_code);
      }
      const existingToken = await this.deviceRepository.findOne({
        where: {
          token_Device: token,
          system: existingSystem,
          MuteNotification: false,
          deletedAt: IsNull(),
        },
      });

      if (!existingToken) {
        const NoContentErr = NoContent(
          'توکن یافت نشد یا غیرفعال است',
          'Token not found or disabled',
        );
        throw new HttpException(NoContentErr, NoContentErr.status_code);
      }
      const payload = {
        notification: {
          title: title,
          body: message,
        },
      };

      const res = await this.firebaseMessaging.sendNotification(
        token,
        payload,
        existingSystem.firebaseServiceAccountPath,
      );
      if (
        res &&
        res.errorCode === 'messaging/registration-token-not-registered'
      ) {
        await this.deviceRepository
          .createQueryBuilder()
          .update(DeviceEntity)
          .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
          .where('id = :id', { id: existingToken.id })
          .execute();

        return {
          message:
            'اعلان ارسال نشد - توکن دستگاه نامعتبر است و از سیستم حذف شد',
          status: 'notification_not_sent',
        };
      }

      return {
        message: 'اعلان با موفقیت ارسال شد',
        notificationId: res,
      };
    } catch (error) {
      if (error.status === undefined) {
        const formatError = InternalServerError(error.message);
        throw new HttpException(formatError, formatError.status_code);
      } else throw error;
    }
  }
}
