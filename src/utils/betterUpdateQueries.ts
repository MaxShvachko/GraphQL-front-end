import { Cache, QueryInput} from '@urql/exchange-graphcache';

export function typedUpdateQueries<R, Q>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  callback: (value: R, query: Q) => Q
) {
  return cache.updateQuery(queryInput, (data) => callback(result, data as any) as any)
}
