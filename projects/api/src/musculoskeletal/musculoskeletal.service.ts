import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Musculoskeletal } from "./musculoskeletal.entity";

@Injectable()
export class MusculoskeletalService {
  constructor(
    @InjectRepository(Musculoskeletal)
    private readonly musculoskeletalRepo: Repository<Musculoskeletal>
  ) {}

  getMusculoskeletalRepository(): Repository<Musculoskeletal> {
    return this.musculoskeletalRepo;
  }
}
