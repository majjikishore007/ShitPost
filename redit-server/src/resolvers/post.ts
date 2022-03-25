import { Vote } from '../entities/Vote';
import { MyContext } from 'src/types';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Post } from '../entities/Post';
import { isAuth } from '../middleware/isAuth';

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    if (root.text.length > 50) {
      return root.text.slice(0, 50);
      
    }
    return root.text;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;

    const updoot = await Vote.findOne({ where: { postId, userId } });
    // if the user voted and want to change the vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
    update vote
    set value = $1
    where "postId" = $2 and "userId" = $3
        `,
          [realValue, postId, userId]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
        `,
          [2 * realValue, postId]
        );
      });
    } else if (!updoot) {
      await getConnection().transaction(async (t) => {
        await t.query(
          `
        insert into vote ("userId", "postId", value)
        values ($1,$2,$3)
        `,
          [userId, postId, realValue]
        );

        await t.query(
          `        
        update post
        set points = points + $1
        where id=$2
        `,
          [realValue, postId]
        );
      });
    }

    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const reaLimitPlusOne = realLimit + 1;
    const { userId } = req.session;
    const replacements: any[] = [reaLimitPlusOne];
        if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
      select
      p.*,
      json_build_object(
        'id',u.id,
        'username',u.username,
        'email',u.email,
        'createdAt',u."createdAt",
        'updatedAt',u."updatedAt"
      ) creator
      from post p 
      inner join public.user u on u.id = p."creatorId"
      ${cursor ? ` where p."createdAt" < $2` : ''}
      order by p."createdAt" DESC
      limit $1
      `,
      replacements
    );
    /*
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p')
      .orderBy('"createdAt"', 'DESC')
      .take(reaLimitPlusOne);
    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }
    const posts = await qb.getMany();
    */

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === reaLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true }) // defining the typegraphql type
  post(@Arg('id') id: number): Promise<Post | undefined> {
    // ts types [Post | null]

    return Post.findOne({ id });
  }

  @Mutation(() => Post) // return type of the mutation
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true }) // return type of the mutation
  async updatePost(
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean) // return type of the mutation
  async deletePost(@Arg('id') id: number): Promise<Boolean> {
    try {
      await Post.delete({ id });
    } catch {
      return false;
    }
    return true;
  }
}
