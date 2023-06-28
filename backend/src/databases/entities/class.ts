import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';

@Entity('class')
export class Classes {
    @PrimaryColumn({
        type:'varchar',
        length: '6',
        name: 'id',
        unsigned: true,
    })
    id: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'name',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'time_table',
        nullable: false,
    })
    timeTable: string;

    @Column({
        type: 'int',
        name: 'number_student',
        nullable: false,
    })
    numberStudent: number;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'type',
        nullable: false,
    })
    fee: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'subject_id',
        nullable: false,
    })
    subjectId: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'teacher',
        nullable: false,
    })
    teacher: string;

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

    @ManyToOne(() => Subject, d => d.classes)
    @JoinColumn({name: 'subject_id', referencedColumnName: 'id'})
    subject: Subject;
}

