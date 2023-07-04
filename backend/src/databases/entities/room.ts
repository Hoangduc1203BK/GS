import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne, BeforeUpdate } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { Classes } from './class';
import { TimeTable } from './time-table';
import { Exam } from './exam';

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

    @Column({
        type: 'varchar',
        length: '50',
        name: 'description',
        nullable: true,
    })
    description: string;

    @OneToMany(() => TimeTable, t => t.room)
    schedules: TimeTable[];

    @OneToMany(() => Exam, e => e.room)
    exams: Exam[];
}

