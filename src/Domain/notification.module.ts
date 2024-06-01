import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CqrsModule } from '@nestjs/cqrs';
import { FirebaseAdminModule } from 'src/Configs/fireBase/firebase.module';
@Module({
  imports: [
    FirebaseAdminModule,
    CqrsModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService,],
  exports: [NotificationService],
})
export class NotificationModule {}
