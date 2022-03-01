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
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";

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
  /**
   *
   * @param req.session.userId
   * @returns  user | null
   * @description This query checks for a user in the session anb returns the user
   */
  @Query(() => User, { nullable: true })
  me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }
    const user = em.findOne(User, { id: req.session.userId });
    return user;
  }

  /**
   *
   * @param username
   * @param password
   * @returns The user if does not exist
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req, em }: MyContext
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

    req.session.userId = user.id;
    return {
      user,
    };
  }
  /**
   *
   * @param username
   * @param password
   * @returns creates a session for the user if the entered credentials are valid
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    console.log("Cheching ", options);
    
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
    // setting the user cookie in the express session
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
      });
    });

    res.clearCookie(COOKIE_NAME);
    return true;
  }
}
