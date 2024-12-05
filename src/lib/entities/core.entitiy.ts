import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("cores")
export class Core {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", unique: true })
  token: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
