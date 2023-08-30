import { Category } from '@/category/category.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('story')
export class Story {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'text' })
  title: string;

  @Column({ name: 'keywords', type: 'text' })
  keywords: string;

  @Column({ name: 'short_content', type: 'text' })
  shortContent: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne((type) => Category, { nullable: true, eager: false })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id'
  })
  category?: Category;

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
