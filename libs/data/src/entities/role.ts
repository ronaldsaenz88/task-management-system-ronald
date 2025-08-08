import { Entity, Column } from 'typeorm';
import { BaseEntityModel } from './base';

@Entity()
export class Role extends BaseEntityModel {
  @Column({ unique: true })
  name: string; // Owner, Admin, Viewer
}
