import { createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";

const client = createClient({
  url: "http://localhost:3000/graphql",
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (result, args, cache, info) => {},
        },
      },
    }),
    fetchExchange,
  ],
});
