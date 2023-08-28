import { exceptions } from "@medical-musculoskeletal/logger";
import { Controller, Get, HttpException, Param, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MusculoskeletalService } from "../musculoskeletal/musculoskeletal.service";

@ApiTags("Musculoskeletal")
@Controller("/musculoskeletal")
@ApiBearerAuth()
export class AdminMusculoskeletalController {
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
    return [];
  }

  @Get("/:id")
  @ApiParam({ name: "id", description: "Musculoskeletal Id", required: true })
  //   @ApiOkResponse({
  //     description: 'Get Musculoskeletal',
  //     type: any
  //   })
  public async getMusculoskeletalById(@Param("id") id: string): Promise<any> {
    try {
      //   const data = await this.musculoskeletalService.getMusculoskeletalById(id);
      //   if (!data) {
      //     throw new NotFoundException('Musculoskeletal not found');
      //   }

      return {};
    } catch (e) {
      const ex = exceptions("[Get Transfer Peer error]", e);
      throw new HttpException(ex.message, ex.statusCode);
    }
  }
}
