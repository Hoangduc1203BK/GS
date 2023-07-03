import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user';

@Entity('auths')
export class Auth {
    @PrimaryGeneratedColumn({
        type: 'int',
		name: 'id',
    })
    id: string;

    @Column({
        type: 'varchar',
        length: '300',
        name: 'token',
        nullable: false,
    })
    token: string;

    @Column({
        type: 'timestamp',
        name: 'expires',
        nullable: false,
    })
    expires: Date;

    @Column({
		type: 'boolean',
		name: 'blacklisted',
		default: false,
	})
	blacklisted: boolean;

	@Column({
		type: 'varchar',
		length: '6',
		name: 'user_id',
		nullable: true,
	})
	userId: string;

    @ManyToOne(() => User, u => u.auth)
    @JoinColumn({name: 'user_id', referencedColumnName:'id'})
    user: User;
}

