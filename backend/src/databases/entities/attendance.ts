import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { SubAttendance } from './sub-attendance';

@Entity('attendance')
export class Attendance {
    @PrimaryColumn({
        type:'varchar',
        length: '6',
        name: 'id',
        unsigned: true,
    })
    id: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'teacher_of_day',
        nullable: false,
    })
    teacherId: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'class_id',
        nullable: false,
    })
    classId: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'date',
        nullable: false,
    })
    date: string;

    @Column({
        type: 'varchar',
        length: '10',
		name: 'day',
        nullable: false,
	})
	day: string;

    @Column({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	ctime: Date;

    @ManyToOne(() => Classes, c => c.attendances)
    @JoinColumn({ name: 'class_id', referencedColumnName: 'id'})
    classes: Classes;

    @OneToMany(() => SubAttendance, s => s.attendance)
    subAttendances: SubAttendance[];
}

