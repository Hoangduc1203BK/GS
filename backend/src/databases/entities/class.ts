import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { UserClass } from './user-class';
import { Attendance } from './attendance';
import { TestLearning } from './test-learning';
import { Assigment } from './assigment';

@Entity('class')
export class Classes {
    @PrimaryColumn({
        type:'varchar',
        length: '6',
        name: 'id',
        unsigned: true,
    })
    id: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'int',
        name: 'number_student',
        nullable: false,
    })
    numberStudent: number;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'type',
        nullable: false,
    })
    type: string;

    @Column({
        type: 'int',
        name: 'fee',
        nullable: false,
    })
    fee: number;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'subject_id',
        nullable: false,
    })
    subjectId: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'teacher',
        nullable: true,
    })
    teacher?: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'teacher_rate',
        nullable: true,
    })
    teacherRate: number;


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

    @Column({
		name: 'deleted_at',
		type: 'timestamp',
        nullable: true,
	})
	dtime: Date;

	@BeforeUpdate()
	updateDates() {
		this.mtime = new Date();
	}

    @ManyToOne(() => Subject, d => d.classes)
    @JoinColumn({name: 'subject_id', referencedColumnName: 'id'})
    subject: Subject;

    @ManyToOne(() => User, u => u.classes)
    @JoinColumn({name: 'teacher', referencedColumnName: 'id'})
    user: User;

    // @ManyToOne(() => Room, r => r.classes)
    // @JoinColumn({name: 'roomId', referencedColumnName: 'id'})
    // room: Room;

    @OneToMany(() => TimeTable, t => t.classes)
    timeTables: TimeTable[];

    @OneToMany(() => UserClass, uc => uc.classes)
    userClass: UserClass[];

    @OneToMany(() => Attendance, t => t.classes)
    attendances: Attendance[];


    //assigment
    @OneToMany(() => Assigment, a => a.classes)
    assigments: Assigment[];
}

