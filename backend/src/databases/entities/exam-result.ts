import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { Attendance } from './attendance';
import { Exam } from './exam';
import { RegisterExam } from './register-exam';

@Entity('exam-results')
export class ExamResult {
    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'int',
        name: 'register_id',
        nullable: false,
    })
    registerId: number;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'subject_id',
        nullable: false,
    })
    subjectId: string;

    @Column({
        type: 'decimal',
		precision: 10,
		scale: 2,
        name: 'score',
        nullable: true,
    })
    score: number;

    @ManyToOne(() => RegisterExam, re => re.results)
    @JoinColumn({name: 'register_id', referencedColumnName: 'id'})
    registerExam: RegisterExam;
}

