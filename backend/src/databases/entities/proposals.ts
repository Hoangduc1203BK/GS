import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { STUDENT_REGISTER_CLASS, STUDENT_TERMINATE_CLASS, TEACHER_REGISTER_CLASS, TEACHER_TAKE_BRAKE } from 'src/common/interfaces/proposals';

@Entity('proposals')
export class Proposals {
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
        length: '100',
        name: 'type',
        nullable: false,
    })
    type: string;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'time',
        nullable: false,
    })
    time: string;

    @Column({
        type: 'varchar',
        length: '100',
        name: 'description',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'varchar',
        length: '100',
        name: 'status',
        nullable: false,
    })
    status: string;

    @Column({
        type: 'jsonb',
        name: 'sub_data',
        nullable: false,
    })
    subData: TEACHER_REGISTER_CLASS | STUDENT_REGISTER_CLASS | TEACHER_TAKE_BRAKE | STUDENT_TERMINATE_CLASS;

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

    //user
    @ManyToOne(() => User, u => u.proposals)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;
    
}

