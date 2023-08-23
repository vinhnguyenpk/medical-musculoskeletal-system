import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  // @PublicRoute()
  getVersion() {
    return { name: "Platform API", timestamp: Date.now() };
  }
}
