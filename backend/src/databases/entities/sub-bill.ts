import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import { Classes } from './class';
import { Bill } from './bill';

@Entity('sub-bills')
export class SubBill {
    @PrimaryGeneratedColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;


    @Column({
        type: 'varchar',
        length: '6',
        name: 'bill_id',
        nullable: false,
    })
    billId: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'class_id',
        nullable: false,
    })
    classId: string;

    @Column({
        type: 'varchar',
        name: 'number_study',
        nullable: false,
    })
    numberStudy: string;

    @Column({
        type: 'boolean',
        name: 'status',
        nullable: false,
    })
    status: boolean;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        name: 'total',
        nullable: false,
    })
    total: number;

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
    @ManyToOne(() => Bill, b => b.subBills)
    @JoinColumn({name: 'bill_id', referencedColumnName: 'id'})
    bill: Bill;

    @ManyToOne(() => Classes, c => c.subBills)
    @JoinColumn({name: 'class_id', referencedColumnName: 'id'})
    classes: Classes;
}

