import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { Exam } from './exam';
import { ExamResult } from './exam-result';

@Entity('register-exam')
export class RegisterExam {
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
    userId: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'exam_id',
        nullable: false,
    })
    examId: string;

    @Column({
        type: 'bool',
        name: 'status',
        nullable: false,
    })
    status: boolean;

    @Column({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	ctime: Date;

    @ManyToOne(() => User, u => u.registerExams)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;

    @ManyToOne(() => Exam, e => e.registerExams)
    @JoinColumn({name: 'exam_id', referencedColumnName: 'id'})
    exam: Exam;

    @OneToMany(() => ExamResult, e => e.registerExam)
    results: ExamResult[];
}

