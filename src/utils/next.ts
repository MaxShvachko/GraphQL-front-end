import { GetServerSidePropsContext } from 'next';
import { initUrqlClient } from 'next-urql';
import { ssrExchange, Client } from 'urql';
import { createUrqlClient } from './createUrqlClient';

type AsyncCallback = (client: Client, context: GetServerSidePropsContext) => Promise<void>;

export const authorizedGuard = (callback?: AsyncCallback) => async(ctx: GetServerSidePropsContext)=> {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient(
    createUrqlClient(ssrCache),
    false
  ) as Client;

  if (callback) {
    await callback(client, ctx);
  }

  return {
    props: {
      urqlState: ssrCache.extractData(),
    },
  };
}
