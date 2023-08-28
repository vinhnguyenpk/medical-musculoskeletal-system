import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("story")
export class Story {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ name: "keywords", type: "text" })
  keywords: string;

  @Column({ name: "content", type: "text" })
  content: string;

  @Column({ name: "category_id", type: "uuid" })
  categoryId: string;

  @Column({
    name: "created_at",
    type: "timestamptz",
    nullable: false,
    default: () => "now()",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamptz",
    nullable: true,
    onUpdate: "now()",
  })
  updatedAt: Date;
}
