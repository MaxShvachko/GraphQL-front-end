import { NextPageContext } from 'next';
import { initUrqlClient } from 'next-urql';
import { ssrExchange, Client } from 'urql';
import { createUrqlClient } from './createUrqlClient';

type AsyncCallback = (client: Client, context: NextPageContext) => Promise<void>;

export const authorizedGuard = (callback?: AsyncCallback) => async(ctx: NextPageContext) => {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    createUrqlClient(ssrCache, ctx),
    false
  ) as Client;

  if (callback) {
    await callback(client, ctx);
  }

  return {
    props: {
      urqlState: ssrCache.extractData()
    }
  };
};
