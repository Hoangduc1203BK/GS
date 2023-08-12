import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Classes } from './class';
import { SubExam } from './sub-exam';
import { User } from './user';
import { Room } from './room';

@Entity('history-price')
export class HistoryPrice {
    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;


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
        name: 'old_price',
        nullable: false,
    })
    oldPrice: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'new_price',
        nullable: false,
    })
    newPrice: number;

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

    @ManyToOne(() => Classes, c => c.histories)
    @JoinColumn({name: 'class_id', referencedColumnName:'id'})
    classes: Classes;
}

