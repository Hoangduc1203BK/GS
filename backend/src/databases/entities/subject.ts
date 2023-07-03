import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate } from 'typeorm';
import { Department } from './department';
import { Classes } from './class';
import { SubExam } from './sub-exam';

@Entity('subjects')
export class Subject {
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
        name: 'grade',
        nullable: false,
    })
    grade: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'description',
        nullable: false,
    })
    description: string;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'department_id',
        nullable: false,
    })
    departmentId: string;

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

    @ManyToOne(() => Department, d => d.subject)
    @JoinColumn({name: 'department_id', referencedColumnName: 'id'})
    department: Department;

    @OneToMany(() => Classes, (c) => c.subject)
    classes: Classes[];

    @OneToMany(() => SubExam, se => se.subject)
    subExams: SubExam[];
}

