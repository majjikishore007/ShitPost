import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  InputType,
  Mutation,
  Resolver,
  Field,
  Arg,
  Ctx,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true }) //explicitly define the types if we want nullable
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    //password length validation
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username must be at least 2 characters",
          },
        ],
      };
    }
    if (options.password.length < 3) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be at least 3 characters",
          },
        ],
      };
    }
    //user duplication validation
    const userExists = await em.findOne(User, { username: options.username });
    if (userExists) {
      return {
        errors: [
          {
            field: "username",
            message: "user already exists please log in",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "User does not exist !",
          },
        ],
      };
    }
    const vaild = await argon2.verify(user.password, options.password);
    if (!vaild) {
      console.log("Password verification");

      return {
        errors: [
          {
            field: "password",
            message: "Password is incorrect !",
          },
        ],
      };
    }
    console.log("session::::::::: ", req.session);

    req.session.userId = user.id;
    return {
      user,
    };
  }
}
