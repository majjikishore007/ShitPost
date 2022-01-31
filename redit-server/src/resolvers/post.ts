import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    let post = em.find(Post, {});
    console.log("Post \n", post);
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true }) // defining the typegraphql type
  post(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
    // ts types [Post | null]

    return em.findOne(Post, { id });
  }
  @Mutation(() => Post) // return type of the mutation
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }
  @Mutation(() => Post, { nullable: true }) // return type of the mutation
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
    }
    await em.persistAndFlush(post);
    return post;
  }
  @Mutation(() => Boolean) // return type of the mutation
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    try {
      await em.nativeDelete(Post, { id });
    } catch {
      return false;
    }
    return true;
  }
}