import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { paginate } from "../pagination/helper";
import { PaginatedList } from "../pagination/types";
import { Post } from "./post.entity";
import {
  CreatePostParams,
  GetPostParams,
  PostDto,
  UpdatePostParams,
} from "./post.dto";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>
  ) {}

  getPostRepository(): Repository<Post> {
    return this.postRepo;
  }

  public async getAll(request: GetPostParams): Promise<PaginatedList<PostDto>> {
    const query = this.postRepo.createQueryBuilder("c");
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

  public async getById(id: string): Promise<PostDto> {
    return this.postRepo.findOne({ where: { id } });
  }

  public async createPost(params: CreatePostParams): Promise<Post> {
    const post = this.postRepo.create();
    post.content = params.content;
    post.keywords = params.keywords;
    post.categoryId = params.categoryId;

    await this.postRepo.save(post, { reload: true });

    return post;
  }

  public async updatePost(id: string, params: UpdatePostParams): Promise<Post> {
    const post = await this.postRepo.findOneOrFail({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotAcceptableException("Post not found");
    }

    post.content = params.content;
    post.keywords = params.keywords;
    post.categoryId = params.categoryId;
    post.updatedAt = new Date();

    await this.postRepo.save(post);
    return post;
  }
}
