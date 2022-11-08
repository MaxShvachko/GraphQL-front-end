import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { dedupExchange, Exchange, fetchExchange } from 'urql';
import { SSRExchange, withUrqlClient as UrqlHOC } from 'next-urql';
import { pipe, tap } from 'wonka';
import Router from 'next/router';
import { NextPageContext } from 'next/types';

import { API_HOST } from 'src/constants/api';
import { ROUTES } from 'src/constants/routes';
import { typedUpdateQueries } from 'src/utils/betterUpdateQueries';
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegistrationMutation } from 'src/generated/graphql';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message?.includes('not authenticated')) {
          Router.replace(ROUTES.LOGIN);
        }
      }
    })
  );
};

export const cursorPagination = (typeName: string): Resolver<any, any, any> => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const result: string[] = [];

    const cashData = cache.resolve(entityKey, fieldName, fieldArgs);

    info.partial = !cashData;

    let hasMore = true;

    fieldInfos.forEach((info) => {
      const key = cache.resolve(entityKey, info.fieldKey) as string;
      const data = cache.resolve(key, 'data') as string[];
      const _hasMore = cache.resolve(key, 'hasMore') as string[];

      if (!_hasMore) {
        hasMore = _hasMore;
      }

      result.push(...data);
    });

    return {
      __typename: typeName,
      data: result,
      hasMore
    };
  };
};

export const createUrqlClient = ((ssrCache: SSRExchange, ctx?: NextPageContext) => {
  let cookies = '';
  if (ctx) {
    cookies = ctx.req?.headers.cookie as string;
  }

  return ({
    url: API_HOST,
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookies ? { cookies } : undefined
    },
    exchanges: [dedupExchange, cacheExchange({
      keys: {
        PaginatedPost: () => null,
        UserResponse: () => null
      },
      resolvers: {
        Query: {
          posts: cursorPagination('PaginatedPost')
        }
      },
      updates: {
        Mutation: {
          vote: (_resultValue, _args, cache) => {
            const allFields = cache.inspectFields('Query');

            const postsCash = allFields.filter((info) => info.fieldName === 'posts');

            postsCash.forEach((post) => {
              cache.invalidate('Query', 'posts', post.arguments);
            });
          },
          createPost: (_resultValue, _args, cache) => {
            const allFields = cache.inspectFields('Query');

            const postsCash = allFields.filter((info) => info.fieldName === 'posts');

            postsCash.forEach((post) => {
              cache.invalidate('Query', 'posts', post.arguments);
            });
          },
          login: (resultValue, _args, cache) => {
            typedUpdateQueries<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              resultValue,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login
                  };
                }
              });
          },
          register: (resultValue, _args, cache) => {
            typedUpdateQueries<RegistrationMutation, MeQuery>(
              cache,
              { query: MeDocument },
              resultValue,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register
                  };
                }
              });
          },
          logout: (resultValue, _args, cache) => {
            typedUpdateQueries<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              resultValue,
              () => {
                return {
                  me: {
                    __typename: 'UserResponse',
                    user: null,
                    errors: null
                  }
                };
              });
          },
          changePassword: (resultValue, _args, cache) => {
            typedUpdateQueries<ChangePasswordMutation, MeQuery>(
              cache,
              { query: MeDocument },
              resultValue,
              (result, query) => {
                if (result.changePassword.errors) {
                  return query;
                } else {
                  return {
                    me: result.changePassword
                  };
                }
              });
          }
        }
      }
    }),
    ssrCache,
    fetchExchange,
    errorExchange
    ]
  });
});

export const withUrqlClient = UrqlHOC(
  createUrqlClient,
  { ssr: false }
);
