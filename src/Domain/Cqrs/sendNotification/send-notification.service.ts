import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/Configs/fireBase/firebase.service';
import { System } from 'src/Domain/Entities/System.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SendNotificationService {
    constructor(
        @InjectRepository(System)
        private readonly SystemRepository: Repository<System>,
        private firebaseMessaging: FirebaseService,
      ) {}
      
    async findSystem(
        system_name: string,
        system_password: string,
      ): Promise<System> {
        return await this.SystemRepository.findOne({
          where: {
            systemName: system_name,
            systemPassword: system_password,
          },
        });
      }
      
    async  splitIntoBatches(tokens, batchSize) {
        const batches = [];
        for (let i = 0; i < tokens.length; i += batchSize) {
          batches.push(tokens.slice(i, i + batchSize));
        }
        return batches;
      }

      
      async sendNotificationBatch(title: string, message: string, tokens: string[]) {
        const payload = {
          notification: {
            title: title,
            body: message,
          },
          tokens: tokens,
        };
        try {
          const response = await this.firebaseMessaging.sendMulticast(payload);
          console.log('Successfully sent message:', response);
          return response;
        } catch (error) {
          console.error('Error sending message:', error);
          throw error;
        }
      }
    }

