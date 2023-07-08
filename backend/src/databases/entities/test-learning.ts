import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { Attendance } from './attendance';

@Entity('test-learning')
export class TestLearning {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'user_id',
        nullable: false,
    })
    studentId: string;

    @Column({
        type: 'int',
        name: 'time_table_id',
        nullable: false,
    })
    timeTableId: number;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'status',
        nullable: false,
    })
    status: string;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'day',
        nullable: true,
    })
    day: string;

    @Column({
        type: 'varchar',
        length: '100',
        name: 'description',
        nullable: true,
    })
    description: string;

    @ManyToOne(() => User, u => u.testLearnings)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    student: User;

    @ManyToOne(() => TimeTable, c => c.testLearnings)
    @JoinColumn({ name: 'time_table_id', referencedColumnName: 'id' })
    timeTable: TimeTable;
}

