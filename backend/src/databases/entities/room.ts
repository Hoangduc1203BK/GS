import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne, BeforeUpdate } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { Classes } from './class';
import { TimeTable } from './time-table';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'name',
        nullable: false,
    })
    name: string;

    @OneToMany(() => TimeTable, t => t.room)
    schedules: TimeTable[];
}

