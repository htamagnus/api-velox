import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('athletes')
export class AthleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

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
  averageSpeedStrava?: number;

  @Column({ nullable: true, unique: true })
  stravaId: string;

  @Column()
  accessToken: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ default: false })
  isProfileComplete: boolean;

  @Column({ type: 'bigint', nullable: true })
  tokenExpiresAt: number;
}
