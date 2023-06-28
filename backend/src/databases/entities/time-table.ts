import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, OneToMany, OneToOne, BeforeUpdate } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { Classes } from './class';

@Entity('time-tables')
export class TimeTable {
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
        name: 'date',
        nullable: false,
    })
    date: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'start',
        nullable: false,
    })
    start: string;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'end',
        nullable: false,
    })
    end: string;

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
}

