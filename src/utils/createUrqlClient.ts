import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, Exchange, fetchExchange } from 'urql'
import { SSRExchange, withUrqlClient as UrqlHOC } from 'next-urql';
import { pipe, tap } from 'wonka';
import Router from 'next/router';

import { API_HOST } from 'src/constants/api';
import { ChangePasswordMutation, LoginMutation, LogoutMutation, MeDocument, MeQuery, RegistrationMutation } from 'src/generated/graphql';
import { typedUpdateQueries } from 'src/utils/betterUpdateQueries';
import { ROUTES } from 'src/constants/routes';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error })=> {
      if (error) {
        if (error?.message?.includes('not authenticated')) {
          Router.replace(ROUTES.LOGIN);
        }
      }
    })
  )
} 


export const createUrqlClient = ((ssrCache: SSRExchange) => ({ 
  url: API_HOST,
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (resultValue, _args, cache, _info) => {
         typedUpdateQueries<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          resultValue,
          (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {
                me: result.login,
              }
            }
          })
        },
        register: (resultValue, _args, cache, _info) => {
          typedUpdateQueries<RegistrationMutation, MeQuery>(
           cache,
           { query: MeDocument },
           resultValue,
           (result, query) => {
             if (result.register.errors) {
               return query;
             } else {
               return {
                 me: result.register,
               }
             }
           })
        },
        logout: (resultValue, _args, cache, _info) => {
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
              }
           })
        },
        changePassword: (resultValue, _args, cache, _info) => {
          typedUpdateQueries<ChangePasswordMutation, MeQuery>(
           cache,
           { query: MeDocument },
           resultValue,
           (result, query) => {
             if (result.changePassword.errors) {
               return query;
             } else {
               return {
                 me: result.changePassword,
               }
             }
           })
         },
      }
    }
  }), 
  ssrCache,
  fetchExchange,
  errorExchange
  ],
}));

export const withUrqlClient = UrqlHOC(
  createUrqlClient,
  { ssr: false }
);
