import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { System } from '../Entities/System.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(System)
    private readonly SystemRepository: Repository<System>,
  ) {}

  async findSystem(system_name: string, system_password: string): Promise<any> {
    return await this.SystemRepository.findOne({
      where: {
        systemName: system_name,
        systemPassword: system_password,
      },
    });
  }
}
