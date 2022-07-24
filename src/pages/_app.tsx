import { ChakraProvider } from '@chakra-ui/react'
import { cacheExchange } from '@urql/exchange-graphcache';
import { AppProps } from 'next/app'
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql'

import { API_HOST } from 'src/constants/api';
import theme from '../theme'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegistrationMutation } from 'src/generated/graphql';
import { typedUpdateQueries } from 'src/utils/betterUpdateQueries';

const client = createClient({ 
  url: API_HOST,
  fetchOptions: {
    credentials: 'include'
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
      }
    }
  }), fetchExchange],
 });

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
