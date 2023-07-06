import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';
import { Attendance } from './attendance';
import { Exam } from './exam';

@Entity('sub-exam')
export class SubExam {
    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'int',
        name: 'exam_id',
        nullable: false,
    })
    examId: number;

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

    @ManyToOne(() => Exam, e => e.subExams)
    @JoinColumn({name: 'exam_id', referencedColumnName: 'id'})
    exam: Exam;

    @ManyToOne(() => Subject, s => s.subExams)
    @JoinColumn({name: 'subject_id', referencedColumnName: 'id'})
    subject: Subject;
}

