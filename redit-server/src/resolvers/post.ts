import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true }) // defining the typegraphql type
  post(@Arg('id') id: number): Promise<Post | undefined> {
    // ts types [Post | null]

    return Post.findOne({ id });
  }
  @Mutation(() => Post) // return type of the mutation
  async createPost(@Arg('title') title: string): Promise<Post> {
    return Post.create({ title }).save();
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
