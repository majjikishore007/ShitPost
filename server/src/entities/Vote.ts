import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity()
export class Vote extends BaseEntity {
  @Field()
  @Column({ type: 'int' })
  value: number;

  @Field()
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  postId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;
}
