import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("musculoskeletal")
export class Musculoskeletal {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ name: "name", type: "string" })
  name: string;

  @Column({ name: "type", type: "string" })
  type: string;

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
