import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { COOKIE_NAME, __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

//expirement

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'redit',
    username: 'postgres',
    password: 'psql',
    logging: true,
    synchronize: true,
    entities: [Post, User],
  });

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  redis.set('congo', 'connectRedis');
  console.log(
    'yay! your redis successfully connected',
    await redis.get('congo')
  );

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 364 * 10, // 10 years
        httpOnly: true, // make the cookie unaccessible for the frontend
        sameSite: 'lax',
        secure: __prod__, // for security
      },
      saveUninitialized: false,
      secret: 'hsdkhfjkahfdhasjhfjashdfjhalhhdhdq',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log('server is listening on port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
