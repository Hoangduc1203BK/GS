import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { SubAttendance } from './sub-attendance';
import { SubAssigment } from './sub-assigment';

@Entity('assigments')
export class Assigment {
    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'title',
        nullable: false,
    })
    title: string;

    @Column({
        type: 'varchar',
        length: '100',
        name: 'description',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'varchar',
        length: '500',
        name: 'file',
        nullable: true,
    })
    file: string;

    @Column({
        type: 'timestamp',
        name: 'deadline',
        nullable: false,
    })
    deadline: Date;

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
        name: 'status',
        nullable: false,
    })
    status: string;

    @Column({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	ctime: Date;

    @ManyToOne(() => Classes, c => c.attendances)
    @JoinColumn({ name: 'class_id', referencedColumnName: 'id'})
    classes: Classes;

    @OneToMany(() => SubAssigment, s => s.assigment)
    subAssigments: SubAssigment[];
}

