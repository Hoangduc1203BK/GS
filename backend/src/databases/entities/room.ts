import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne, BeforeUpdate } from 'typeorm';
import { Department } from './department';
import { Subject } from './subject';
import { Classes } from './class';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn({
        type: 'int',
        name: 'id',
        unsigned: true,
    })
    id: number;

    @Column({
        type: 'varchar',
        length: '50',
        name: 'name',
        nullable: false,
    })
    name: string;

    @ManyToOne(() => Classes, c => c.room)
    classes: Classes[];
}

