import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {Turn} from "../../turn/entities/turn.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column()
  rol!: string; // luego podemos mejorar esto

  @OneToMany(() => Turn, (turn) => turn.cliente)
  turnosComoCliente!: Turn[];

  @OneToMany(() => Turn, (turn) => turn.profesional)
  turnosComoProfesional!: Turn[];
}
