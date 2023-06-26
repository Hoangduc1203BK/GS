import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne } from 'typeorm';
import { Department } from './department';

@Entity('subject')
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
        unique: true,
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
        type: 'int',
        name: 'department_id',
        nullable: false,
    })
    departmentId: string;

    @ManyToOne(() => Department, d => d.subject)
    @JoinColumn({name: 'department_id', referencedColumnName: 'id'})
    department: Department
}

