import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('servers')
export class Server {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  serverId: string;

  @Column()
  containerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
