import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Classes } from './class';
import { SubExam } from './sub-exam';
import { User } from './user';
import { Room } from './room';

@Entity('exams')
export class Exam {
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
        name: 'teacher_id',
        nullable: true,
    })
    teacherId: string;

    @Column({
        type: 'int',
        name: 'room_id',
        nullable: true,
    })
    roomId: number;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'hour',
        nullable: true,
    })
    hour: string;


    @Column({
        type: 'varchar',
        length: '10',
        name: 'date',
        nullable: true,
    })
    date: string;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'result',
        nullable: false,
    })
    result: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'description',
        nullable: true,
    })
    description: string;

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

    @OneToMany(() => SubExam, se => se.exam)
    subExams: SubExam[];

    //teacher
    @ManyToOne(() => User, u => u.exams)
    @JoinColumn({name: 'teacher_id', referencedColumnName: 'id'})
    teacher: User;

    //student
    @OneToOne(() => User, u => u.exam)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    student: User;

    @ManyToOne(() => Room, r => r.exams)
    @JoinColumn({name: 'room_id', referencedColumnName:'id'})
    room: Room;
}

