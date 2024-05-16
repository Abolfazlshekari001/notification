import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { System } from './System.entity';
import { SubscriptionEntity } from './Subscription.entities';
@Entity('DeviceEntity')
export class DeviceEntity extends BaseEntity {

  // [x: string] : Any attribute type with arbitrary string names (specified by x) and values ​​of any type (any).
  //... This gives the class a lot of flexibility and allows you to add dynamic properties to entities.
  [x: string]: any;
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true })
  token_Device: string;

  @ApiProperty()
  @Column({ nullable: true })
  platform: string;

  @ApiProperty()
  @Column({ nullable: true })
  userId: string;

  @ApiProperty()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ApiProperty()
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
  
  @OneToMany(() => SubscriptionEntity, (subscribe) => subscribe.device)
  subscribe: SubscriptionEntity[];

  @ManyToMany(() => System, (system) => system.devices)
  @JoinTable({
    name: 'device_systems',
    joinColumn: { name: 'device_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'system_id', referencedColumnName: 'id' },
  })
  systems: System[];
}
