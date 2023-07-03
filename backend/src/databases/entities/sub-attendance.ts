import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { Attendance } from './attendance';

@Entity('sub-attendance')
export class SubAttendance {
    @PrimaryGeneratedColumn({
        type:'int',
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
        name: 'attendance_id',
        nullable: false,
    })
    attendanceId: string;

    @Column({
        type: 'bool',
        name: 'status',
        nullable: false,
    })
    status: boolean;

    @ManyToOne(() => Attendance, u => u.subAttendances)
    @JoinColumn({name: 'attendance_id', referencedColumnName: 'id'})
    attendance: Attendance;

    @ManyToOne(() => User, u => u.subAttendances)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    student: User;
}

