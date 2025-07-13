import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from 'src/domains/Entities/System.entity';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../Entities/Registered-Devices.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(System)
    private readonly SystemRepository: Repository<System>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
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

  async findOneToken(
    tokenId: string,
    system_name: string,
    system_password: string,
  ) {
    const result = await this.deviceRepository.findOne({
      where: {
        id: tokenId,
        deletedAt: null,
        system: { systemName: system_name, systemPassword: system_password },
      },
    });
    return result;
  }
  async findTokenUser(
    userId: string,
    system_name: string,
    system_password: string,
  ) {
    const result = await this.deviceRepository.findOne({
      where: {
        userId,
        deletedAt: null,
        system: { systemName: system_name, systemPassword: system_password },
      },
    });
    return result;
  }
}
