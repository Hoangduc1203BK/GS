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
        type: 'varchar',
        length: '6',
        name: 'class_id',
        nullable: false,
    })
    classId: string;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'status',
        nullable: false,
    })
    status: boolean;

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

    @ManyToOne(() => Classes, c => c.testLearnings)
    @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
    classes: Classes;
}

