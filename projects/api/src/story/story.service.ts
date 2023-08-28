import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate } from "../pagination/helper";
import { PaginatedList } from "../pagination/types";
import { Story } from "./story.entity";
import {
  CreateStoryParams,
  GetStoryParams,
  StoryDto,
  UpdateStoryParams,
} from "./story.dto";

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepo: Repository<Story>
  ) {}

  getStoryRepository(): Repository<Story> {
    return this.storyRepo;
  }

  public async getAll(
    request: GetStoryParams
  ): Promise<PaginatedList<StoryDto>> {
    const query = this.storyRepo.createQueryBuilder("c");
    if (request.keywords) {
      query.andWhere("c.keywords LIKE :keywords", {
        keywords: `%${request.keywords}%`,
      });
    }

    if (request.content) {
      query.andWhere("c.content LIKE :content", {
        content: `%${request.content}%`,
      });
    }

    if (request.categoryId) {
      query.andWhere("c.category_id = :categoryId", {
        categoryId: request.categoryId,
      });
    }
    return await paginate(query, {
      current: request.current,
      pageSize: request.pageSize,
    });
  }

  public async getById(id: string): Promise<StoryDto> {
    return this.storyRepo.findOne({ where: { id } });
  }

  public async createStory(params: CreateStoryParams): Promise<Story> {
    const story = this.storyRepo.create();
    story.content = params.content;
    story.keywords = params.keywords;
    story.categoryId = params.categoryId;

    await this.storyRepo.save(story, { reload: true });

    return story;
  }

  public async updateStory(
    id: string,
    params: UpdateStoryParams
  ): Promise<Story> {
    const story = await this.storyRepo.findOneOrFail({
      where: {
        id,
      },
    });
    if (!story) {
      throw new NotAcceptableException("Story not found");
    }

    story.content = params.content;
    story.keywords = params.keywords;
    story.categoryId = params.categoryId;
    story.updatedAt = new Date();

    await this.storyRepo.save(story);
    return story;
  }
}
