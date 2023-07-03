import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Classes } from './class';
import { SubExam } from './sub-exam';
import { RegisterExam } from './register-exam';
import { User } from './user';
import { Room } from './room';

@Entity('exams')
export class Exam {
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
        type: 'varchar',
        length: '6',
        name: 'teacher_id',
        nullable: false,
    })
    teacherId: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'time',
        nullable: false,
    })
    time: string;

    @Column({
        type: 'int',
        name: 'room_id',
        nullable: false,
    })
    roomId: number;

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

    @OneToMany(() => RegisterExam, re => re.exam)
    registerExams: RegisterExam[];

    @ManyToOne(() => User, u => u.exams)
    @JoinColumn({name: 'teacher_id', referencedColumnName: 'id'})
    teacher: User;

    @ManyToOne(() => Room, r => r.exams)
    @JoinColumn({name: 'room_id', referencedColumnName:'id'})
    room: Room;
}

