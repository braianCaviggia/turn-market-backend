import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Turn {
   
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.turnosComoCliente)
    cliente!: User;

    @ManyToOne(() => User, (user) => user.turnosComoProfesional)
    profesional!: User;

    @Column()
    fecha_hora!: Date;

    @Column()
    estado!: string;

    @Column({ nullable: true })
    motivo!: string;
}
