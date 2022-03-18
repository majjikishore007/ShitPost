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
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/ValidationsRegister';
import { sendMail } from '../utils/sendEmail';
import { v4 } from 'uuid';

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
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }
    const user = User.findOne({ id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'length must be greater than 2',
          },
        ],
      };
    }
    const KEY = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(KEY);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      };
    }
    const userIdNUM = parseInt(userId);
    const user = await User.findOne({ id: userIdNUM });
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      };
    }
    await User.update(
      { id: userIdNUM },
      {
        password: await argon2.hash(newPassword),
      }
    );
    await redis.del(KEY);
    // login the user after chainging the password change
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ email: email });
    if (!user) {
      return true;
    }
    const token = v4();

    redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3
    );
    sendMail(
      email,
      `<a href="http://localhost:3000/change-password/${token}" >reset password</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return {
        errors,
      };
    }
    //user duplication validation
    const userExists = await User.findOne({ email: options.email });

    if (userExists) {
      return {
        errors: [
          {
            field: 'username',
            message: 'user already exists please login',
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = await User.create({
      username: options.username,
      email: options.email,
      password: hashedPassword,
    }).save();

    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    console.log('Cheching ', usernameOrEmail);

    const user = await User.findOne(
      usernameOrEmail.includes('@')
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'User does not exist !',
          },
        ],
      };
    }
    const vaild = await argon2.verify(user.password, password);
    if (!vaild) {
      console.log('Password verification');

      return {
        errors: [
          {
            field: 'password',
            message: 'Password is incorrect !',
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
