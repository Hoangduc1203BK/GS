import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne } from 'typeorm';
import { Subject } from './subject';

@Entity('department')
export class Department {
    @PrimaryColumn({
        type:'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'email',
        nullable: false,
    })
    email: string;

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
        name: 'phone_number',
        nullable: false,
    })
    phone_number: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'description',
        nullable: false,
    })
    description: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'leader',
        nullable: true,
    })
    leader: string;

    @OneToMany(() => Subject, s => s.department)
    subject: Subject[];
}

