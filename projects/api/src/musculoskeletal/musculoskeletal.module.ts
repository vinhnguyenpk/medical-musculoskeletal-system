import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Musculoskeletal } from "./musculoskeletal.entity";
import { MusculoskeletalService } from "./musculoskeletal.service";

@Module({
  imports: [TypeOrmModule.forFeature([Musculoskeletal])],
  providers: [MusculoskeletalService],
  exports: [MusculoskeletalService],
})
export class MusculoskeletalModule {}
