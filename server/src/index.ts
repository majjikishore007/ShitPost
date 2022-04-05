import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import 'dotenv-safe/config';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { COOKIE_NAME, __prod__ } from './constants';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { createUserLoader } from './utils/createUserLoader';
import { createVoteLoader } from './utils/createVoteLoader';

const PORT = parseInt(process.env.PORT);
const REDIS_URL = process.env.REDIS_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const ORIGIN_URL = process.env.ORIGIN;

const main = async () => {
  const connection = await createConnection();

  connection.runMigrations();

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis(REDIS_URL);
  redis.set('congo', 'connectRedis');
  console.log(
    'yay! your redis successfully connected',
    await redis.get('congo')
  );

  app.use(
    cors({
      origin: ORIGIN_URL,
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
      secret: SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      voteLoader: createVoteLoader(),
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(PORT, () => {
    console.log('server is listening on port 4000');
  });
};

main().catch((err) => {
  console.log(err);
});
