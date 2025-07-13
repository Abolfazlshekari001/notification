import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DeviceEntity } from './Registered-Devices.entity';
import { SubscriptionEntity } from './Subscription.entities';
import { topicsEntity } from './Topic.entities';

@Entity('system')
@Unique(['systemName', 'systemPassword'])
export class System extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  systemName: string;

  @ApiProperty()
  @Column()
  systemPassword: string;

  @Column({ nullable: true })
  firebaseServiceAccountPath: string;

  @ManyToMany(() => DeviceEntity, (device) => device.system)
  devices: DeviceEntity[];

  @OneToMany(() => topicsEntity, (topic) => topic.system)
  topic: topicsEntity[];

  @OneToMany(() => SubscriptionEntity, (subscribe) => subscribe.system)
  subscribe: SubscriptionEntity[];
}
