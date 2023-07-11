import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { Attendance } from './attendance';
import { Assigment } from './assigment';

@Entity('sub-assigment')
export class SubAssigment {
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
        type: 'int',
        name: 'assigment_id',
        nullable: false,
    })
    assigmentId: number;

    @Column({
        type: 'varchar',
        length: '20',
        name: 'status',
        nullable: false,
    })
    status: string;

    @Column({
        type: 'decimal',
        precision: 10,
		scale: 2,
        name: 'point',
        nullable: true,
    })
    point: number;

    @Column({
        type: 'varchar',
        length: '100',
        name: 'feedback',
        nullable: true,
    })
    feedback: string;

    @Column({
        type: 'varchar',
        length: '500',
        name: 'file',
        nullable: true,
    })
    file: string;

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

    @ManyToOne(() => Assigment, a => a.subAssigments)
    @JoinColumn({name: 'assigment_id', referencedColumnName: 'id'})
    assigment: Assigment;

    @ManyToOne(() => User, u => u.subAttendances)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    student: User;
}

