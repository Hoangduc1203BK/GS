import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { TimeTable } from './time-table';
import { User } from './user';
import { Room } from './room';
import { Classes } from './class';

@Entity('user-class')
export class UserClass {
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
        name: 'class_id',
        nullable: false,
    })
    classId: string;

    @Column({
        type: 'decimal',
		precision: 10,
		scale: 2,
        name: 'score',
        nullable: true,
    })
    score: number;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'type',
        nullable: false,
    })
    type: string;

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

    @ManyToOne(() => User, u => u.userClass)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;

    @ManyToOne(() => Classes, c => c.userClass)
    @JoinColumn({name: 'class_id', referencedColumnName: 'id'})
    classes: Classes;
}

