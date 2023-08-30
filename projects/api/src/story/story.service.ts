import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from '../pagination/helper';
import { PaginatedList } from '../pagination/types';
import { CreateStoryParams, GetStoryParams, StoryDto, UpdateStoryParams } from './story.dto';
import { Story } from './story.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepo: Repository<Story>
  ) {}

  getStoryRepository(): Repository<Story> {
    return this.storyRepo;
  }

  public async getAll(request: GetStoryParams): Promise<PaginatedList<StoryDto>> {
    const query = this.storyRepo.createQueryBuilder('c').leftJoinAndSelect('c.category', 'ca');

    if (request.keywords) {
      query.andWhere('c.keywords LIKE :keywords', {
        keywords: `%${request.keywords}%`
      });
    }

    if (request.content) {
      query.andWhere('c.content LIKE :content', {
        content: `%${request.content}%`
      });
    }

    if (request.categoryId) {
      query.andWhere('c.category_id = :categoryId', {
        categoryId: request.categoryId
      });
    }
    const { data, total } = await paginate(query, {
      current: request.current,
      pageSize: request.pageSize
    });

    return {
      data: data.map((m) => {
        return {
          id: m.id,
          title: m.title,
          shortContent: m.shortContent,
          keywords: m.keywords,
          content: m.content,
          category: m.category,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt
        };
      }),
      total
    };
  }

  public async getById(id: string): Promise<StoryDto> {
    const story = await this.storyRepo.findOne({
      where: { id },
      relations: ['category']
    });
    return {
      id: story.id,
      title: story.title,
      shortContent: story.shortContent,
      keywords: story.keywords,
      content: story.content,
      category: story.category,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt
    };
  }

  public async createStory(params: CreateStoryParams): Promise<Story> {
    const story = this.storyRepo.create();
    story.title = params.title;
    story.content = params.content;
    story.keywords = params.keywords;
    story.categoryId = params.categoryId;

    await this.storyRepo.save(story, { reload: true });

    return story;
  }

  public async updateStory(id: string, params: UpdateStoryParams): Promise<Story> {
    const story = await this.storyRepo.findOneOrFail({
      where: {
        id
      }
    });
    if (!story) {
      throw new NotAcceptableException('Story not found');
    }
    story.title = params.title;
    story.content = params.content;
    story.keywords = params.keywords;
    story.categoryId = params.categoryId;
    story.updatedAt = new Date();

    await this.storyRepo.save(story);
    return story;
  }
}
