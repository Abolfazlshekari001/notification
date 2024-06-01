import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataNotFound2 } from 'src/Common/translate/Error.Translate';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { SubscriptionEntity } from 'src/Domain/Entities/Subscription.entities';
import { System } from 'src/Domain/Entities/System.entity';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(topicsEntity)
    private readonly topicRpository: Repository<topicsEntity>,
    @InjectRepository(System)
    private readonly SystemRpository: Repository<System>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRpository: Repository<DeviceEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subRpository: Repository<SubscriptionEntity>,
  ) {}

  async findSystem(
    system_name: string,
    system_password: string,
  ): Promise<System> {
    return await this.SystemRpository.findOne({
      where: {
        systemName: system_name,
        systemPassword: system_password,
      },
    });
  }

  async findAll() {
    return this.subRpository.createQueryBuilder('SubscriptionEntity').getMany();
}

  async getTopicSubscriptionsWithDeviceDetails(
    topic_name: string,
    system_name: string,
    system_password: string,
  ): Promise<any> {
    const result = await this.subRpository
      .createQueryBuilder('SubscriptionEntity')
      .leftJoinAndMapMany(
        'SubscriptionEntity.topic',
        topicsEntity,
        'topicsEntity',
        'SubscriptionEntity.topic_id = topicsEntity.id',
      )
      .leftJoinAndMapMany(
        'SubscriptionEntity.device',
        DeviceEntity,
        'DeviceEntity',
        'SubscriptionEntity.device_id = DeviceEntity.id ',
      )
      .leftJoinAndMapMany(
        'SubscriptionEntity.system',
        System,
        'System',
        'SubscriptionEntity.System_id = System.id ',
      )
      .where('topicsEntity.topicName = :topic_name', { topic_name })
      .andWhere(
        'System.systemName =:system_name AND System.systemPassword =:system_password',
        { system_name, system_password },
      )
      .andWhere('topicsEntity.deletedAt IS NULL')
      .andWhere('SubscriptionEntity.unSubscribed_date IS NULL')
      .getMany();
    if (result.length === 0) {
      throw new HttpException(DataNotFound2, DataNotFound2.status_code);
    }
    let aggregatedDevices = [];
    result.forEach((SubscriptionEntity) => {
      aggregatedDevices = aggregatedDevices.concat(
        SubscriptionEntity.device.map((DeviceEntity) => ({
          subscribedDate: SubscriptionEntity.subscribed_Date,
          subescribeId: SubscriptionEntity.id,
          deviceId: DeviceEntity.id,
          deviceToken: DeviceEntity.token_Device,
          platform: DeviceEntity.platform,
        })),
      );
    });
    const topics = result[0].topic.map((topicsEntity) => ({
      topicName: topicsEntity.topicName,
      topicDescription: topicsEntity.descriptions,
      subescribeCount: topicsEntity.countSubescribe,
      insertDate: topicsEntity.created_at,
    }));
    const mappedResults = {
      topics,
      devices: aggregatedDevices,
    };
    return mappedResults;
  }
}
