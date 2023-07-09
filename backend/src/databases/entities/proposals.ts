import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Classes } from './class';
import { SubExam } from './sub-exam';
import { User } from './user';
import { Room } from './room';

@Entity('proposals')
export class Proposals {
    @PrimaryColumn({
        type:'varchar',
        length: '6',
        name: 'id',
        unsigned: true,
    })
    id: string;


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
        type: 'int',
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
    subData: string;

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

