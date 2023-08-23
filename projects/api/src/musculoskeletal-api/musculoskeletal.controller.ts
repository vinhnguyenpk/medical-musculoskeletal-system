import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { MusculoskeletalService } from "../musculoskeletal/musculoskeletal.service";

@ApiTags("Musculoskeletal")
@Controller("/musculoskeletal")
export class MusculoskeletalController {
  constructor(
    private readonly musculoskeletalService: MusculoskeletalService
  ) {}

  @Get("/")
  @ApiQuery({ name: "name", description: "Name", required: false })
  @ApiQuery({
    name: "pageSize",
    description: "Page size",
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: "current",
    description: "Current",
    required: false,
    type: Number,
  })
  //   @ApiOkResponse({
  //     status: 200,
  //     type: any
  //   })
  public async getMusculoskeletal(@Query() request: any): Promise<any> {
    // const ret = await this.musculoskeletalService.getMusculoskeletal({
    // });

    return [];
  }
}
