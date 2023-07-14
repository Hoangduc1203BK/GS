import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Classes } from './class';
import { SubExam } from './sub-exam';
import { User } from './user';
import { Room } from './room';

@Entity('feedbacks')
export class Feedback {
    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;


    @Column({
        type: 'varchar',
        length: '6',
        name: 'from',
        nullable: false,
    })
    from: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'to',
        nullable: false,
    })
    to: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'type',
        nullable: false,
    })
    type: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'class_id',
        nullable: false,
    })
    classId: string;


    @Column({
        type: 'varchar',
        length: '200',
        name: 'feedback',
        nullable: false,
    })
    feedback: string;

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

    // //teacher
    @ManyToOne(() => User, u => u.feedbackFroms)
    @JoinColumn({name: 'from', referencedColumnName: 'id'})
    fromUser: User;

    //student
    @ManyToOne(() => User, u => u.feedbackTos)
    @JoinColumn({name: 'to', referencedColumnName: 'id'})
    toUser: User;

    @ManyToOne(() => Classes, c => c.feedbacks)
    @JoinColumn({name: 'class_id', referencedColumnName:'id'})
    classes: Classes;
}

