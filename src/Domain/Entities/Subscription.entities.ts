import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { topicsEntity } from './Topic.entities';
import { DeviceEntity } from './Registered-Devices.entity';
import { System } from './System.entity';

@Entity('SubscriptionEntity')
export class SubscriptionEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true })
  subscribed_Date: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true })
  unSubscribed_date: Date;

  @ApiProperty()
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @ManyToOne(() => System, (system) => system.subscribe)
  @JoinColumn({ referencedColumnName: 'id', name: 'System_id' })
  system: System;

  @ManyToOne(() => topicsEntity, (topic) => topic.subscribe)
  @JoinColumn({ referencedColumnName: 'id', name: 'topic_id' })
  topic: topicsEntity;

  @ManyToOne(() => DeviceEntity, (device) => device.subscribe)
  @JoinColumn({ referencedColumnName: 'id', name: 'device_id' })
  device: DeviceEntity;
}
