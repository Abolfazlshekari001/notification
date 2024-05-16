import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { System } from './System.entity';
import { SubscriptionEntity } from './Subscription.entities';


@Entity('topicsEntity')
@Unique(['system', 'topicName']) 
export class topicsEntity extends BaseEntity {
  [x: string]: any;

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  topicName: string;

  @ApiProperty()
  @Column()
  descriptions: string;

  @ApiProperty()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ApiProperty()
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @ManyToOne(() => System, (system) => system.topic)
  @JoinColumn({ referencedColumnName: 'id', name: 'System_id' })
  system: System;

  @OneToMany(() => SubscriptionEntity, (subscribe) => subscribe.topic)
  subscribe: SubscriptionEntity[];
}
