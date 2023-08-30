import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
    default: () => 'now()'
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: true,
    onUpdate: 'now()'
  })
  updatedAt: Date;
}
