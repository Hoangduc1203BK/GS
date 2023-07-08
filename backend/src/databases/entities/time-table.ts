import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { Classes } from './class';
import { Room } from './room';
import { TestLearning } from './test-learning';

@Entity('time-tables')
export class TimeTable {
    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'date',
        nullable: false,
    })
    date: string;

    @Column({
		type: 'decimal',
		precision: 10,
		scale: 2,
		name: 'start',
		nullable: false,
	})
	start: number;

	@Column({
		type: 'decimal',
		precision: 10,
		scale: 2,
		name: 'end',
		nullable: false,
	})
	end: number;

    @Column({
        type: 'int',
        name: 'room_id',
        nullable: false,
    })
    roomId: number;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'class_id',
        nullable: false,
    })
    classId: string;

    @ManyToOne(() => Classes, d => d.timeTables)
    @JoinColumn({name: 'class_id', referencedColumnName: 'id'})
    classes: Classes;

    @ManyToOne(() => Room, r => r.schedules)
    @JoinColumn({name: 'room_id', referencedColumnName: 'id'})
    room: Room;

     //test-learning
     @OneToMany(() => TestLearning, t => t.timeTable)
     testLearnings: TestLearning[];
}

