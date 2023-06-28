import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, BeforeUpdate, OneToOne, OneToMany } from 'typeorm';
import { Department } from './department';
import { Auth } from './auth';

@Entity('users')
export class User {
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
        name: 'email',
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        type: 'varchar',
        length: '100',
        name: 'password',
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'birth_day',
        nullable: false,
    })
    birthDay: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'gender',
        nullable: false,
    })
    gender: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'address',
        nullable: false,
    })
    address: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'phone_number',
        nullable: false,
    })
    phoneNumber: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'role',
        nullable: false,
    })
    role: string;
    

// attribute of student
    @Column({
        type: 'varchar',
        length: '50',
        name: 'parent_phone_number',
        nullable: true,
    })
    parentPhoneNumber: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'grade',
        nullable: true,
    })
    grade: string;

// attribute of teacher
    @Column({
        type: 'varchar',
        length: '50',
        name: 'degree',
        nullable: true,
    })
    degree: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'major',
        nullable: true,
    })
    major: string;

    @Column({
        type: 'boolean',
        name: 'graduated',
        nullable: true,
    })
    graduated: boolean;

    @Column({
        type: 'varchar',
        length: '6',
        name: 'department_id',
        nullable: true,
    })
    departmentId: string;

    @Column({
        type: 'int',
        name: 'experience',
        nullable: true,
    })
    experience: number;

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

    @ManyToOne(() => Department, d => d.teacher)
    @JoinColumn({name: 'department_id', referencedColumnName: 'id'})
    department: Department;

    @OneToOne(() => Department, d => d.leader)
    department1: Department;

    @OneToMany(() => Auth, a => a.userId)
    auth: Auth
}
