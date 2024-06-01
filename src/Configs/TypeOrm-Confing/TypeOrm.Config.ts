import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DeviceEntity } from 'src/Domain/Entities/Registered-Devices.entity';
import { SubscriptionEntity } from 'src/Domain/Entities/Subscription.entities';
import { System } from 'src/Domain/Entities/System.entity';
import { topicsEntity } from 'src/Domain/Entities/Topic.entities';

dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT as string),
  database: process.env.DB_NAME,
  entities: [DeviceEntity, System, topicsEntity, SubscriptionEntity],
  synchronize: true,
 // logging: 'all',
};
