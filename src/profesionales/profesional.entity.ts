import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Turno } from '../turnos/turno.entity';

@Entity('profesionales')
export class Profesional {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @Column()
  especialidad: string;

  @OneToMany(() => Turno, turno => turno.profesional)
  turnos: Turno[];
}