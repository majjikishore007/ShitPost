import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
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
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/ValidationsRegister";

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
  errors?: FieldError[]; //? for nullable

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req, em }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }
    const user = em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req, em }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return {
        errors,
      };
    }
    //user duplication validation
    const userExists = await em.findOne(User, { email: options.email });
    if (userExists) {
      return {
        errors: [
          {
            field: "username",
            message: "user already exists please login",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      email: options.email,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);

    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    console.log("Cheching ", usernameOrEmail);

    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "User does not exist !",
          },
        ],
      };
    }
    const vaild = await argon2.verify(user.password, password);
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
