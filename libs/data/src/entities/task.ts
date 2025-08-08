import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntityModel } from './base';
import { Organization } from './organization';
import { User } from './user';

@Entity()
export class Task extends BaseEntityModel {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  dueDate: Date;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy: User;

  @ManyToOne(() => Organization)
  organization: Organization;
}
