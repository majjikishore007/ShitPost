import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from "cors";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

//expirement

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  //making migrations up
  await orm.getMigrator().up();

  // const post =  orm.em.create(Post, {title:"My second post "});
  // await orm.em.persistAndFlush(post)

  // const data = await orm.em.find(Post, {});

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();
  redis.set("congo", "connected");
  app.use(
    cors({
      origin: "http://localhost:3000/",
      credentials: true,
    })
  );
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 364 * 10, // 10 years
        httpOnly: true, // make the cookie unaccessible for the frontend
        sameSite: "lax",
        secure: __prod__, // for security
      },
      saveUninitialized: false,
      secret: "hsdkhfjkahfdhasjhfjashdfjhalhhdhdq",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.get("/", (req, res) => {
    res.send("hello");
  });
  app.listen(4000, () => {
    console.log("server is listening on port 4000");
  });
};

main().catch((err) => {
  console.log(err);
});
