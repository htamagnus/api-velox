import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('athletes')
export class AthleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true })
  averageSpeedRoad?: number;

  @Column({ type: 'float', nullable: true })
  averageSpeedMtb?: number;

  @Column({ type: 'float', nullable: true })
  averageSpeedGeneral?: number;

  @Column({ nullable: true, unique: true })
  stravaId: string;

  @Column({ default: false, nullable: true })
  isProfileComplete: boolean;

  @Column({ nullable: true })
  averageSpeedGeneralIsFromStrava?: boolean;
}
