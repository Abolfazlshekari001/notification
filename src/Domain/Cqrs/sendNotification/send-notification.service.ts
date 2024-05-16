import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from 'src/Domain/Entities/System.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SendNotificationService {
    constructor(
        @InjectRepository(System)
        private readonly SystemRepository: Repository<System>,
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
}
