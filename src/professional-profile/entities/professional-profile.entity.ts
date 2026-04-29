import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ProfessionalProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column()
  profesion!: string;

  @Column('decimal')
  precio_min!: number;

  @Column('decimal')
  precio_max!: number;

  @Column({ nullable: true })
  descripcion!: string;
}
