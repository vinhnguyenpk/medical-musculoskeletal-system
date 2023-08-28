import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Category")
@Controller("/category")
export class CategoryController {
  constructor() {}
}
