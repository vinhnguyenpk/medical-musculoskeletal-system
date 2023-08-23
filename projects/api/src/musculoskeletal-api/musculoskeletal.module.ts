import { Module } from "@nestjs/common";
import { MusculoskeletalModule } from "../musculoskeletal/musculoskeletal.module";
import { MusculoskeletalController } from "./musculoskeletal.controller";

@Module({
  imports: [MusculoskeletalModule],
  controllers: [MusculoskeletalController],
})
export class MusculoskeletalApiModule {}
