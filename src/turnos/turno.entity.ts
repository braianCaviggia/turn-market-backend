import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Profesional } from '../profesionales/profesional.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profesional, profesional => profesional.turnos)
  profesional: Profesional;

  @ManyToOne(() => Usuario)
  cliente: Usuario;

  @Column()
  fecha: string;

  @Column()
  horario: string;

  @Column({ nullable: true })
  mensaje: string;

  @Column({ default: 'pendiente' })
  estado: string;

  @CreateDateColumn()
  creadoEn: Date;
}