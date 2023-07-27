import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from './department';
import { Classes } from './class';
import { SubExam } from './sub-exam';
import { User } from './user';
import { Room } from './room';
import { SubBill } from './sub-bill';

@Entity('bills')
export class Bill {
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
        name: 'type',
        nullable: false,
    })
    type: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'total',
        nullable: false,
    })
    total: number;

    @Column({
        type: 'varchar',
        length: '10',
        name: 'day',
        nullable: false,
    })
    day: string;


    @Column({
        type: 'varchar',
        name: 'description',
        nullable: false,
    })
    description: string;

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

    // //user
    @ManyToOne(() => User, u => u.bills)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;

    //sub-bill
    @OneToMany(() => SubBill, sb => sb.bill)
    subBills: SubBill[];
}

