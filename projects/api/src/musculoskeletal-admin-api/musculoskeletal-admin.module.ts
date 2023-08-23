import { Module } from "@nestjs/common";
import { MusculoskeletalModule } from "../musculoskeletal/musculoskeletal.module";
import { AdminMusculoskeletalController } from "./musculoskeletal-admin.controller";

@Module({
  imports: [MusculoskeletalModule],
  controllers: [AdminMusculoskeletalController],
})
export class MusculoskeletalAdminApiModule {}
