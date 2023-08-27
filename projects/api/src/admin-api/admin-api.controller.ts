import { Controller, Get, SetMetadata } from "@nestjs/common";

@Controller()
export class AdminApiController {
  @SetMetadata("authority", ["public"])
  @Get()
  public getVersion() {
    return {
      time: new Date(),
    };
  }
}
