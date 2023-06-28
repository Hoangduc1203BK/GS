import {
  Column,
  Entity,
  JoinColumn,
  BeforeUpdate,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm';
import { Subject } from './subject';
import { User } from './user';

@Entity('departments')
export class Department {
  @PrimaryColumn({
    type: 'varchar',
    length: '6',
    name: 'id',
    unsigned: true,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: '50',
    name: 'email',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: '50',
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: '50',
    name: 'phone_number',
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: '50',
    name: 'description',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: '50',
    name: 'leader',
    nullable: true,
  })
  leader: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  ctime: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  mtime: Date;

  @BeforeUpdate()
  updateDates() {
    this.mtime = new Date();
  }

  @OneToMany(() => Subject, (s) => s.department)
  subject: Subject[];

  @OneToMany(() => User, (u) => u.department)
  teacher: User[];

  @OneToOne(() => User)
  @JoinColumn({name: 'leader',referencedColumnName: 'id'})
  user: User;
}