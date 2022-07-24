import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  deletePost?: Maybe<Scalars['Boolean']>;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updatePost?: Maybe<Post>;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationLoginArgs = {
  options: RegisterParams;
};


export type MutationRegisterArgs = {
  options: RegisterParams;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: UserResponse;
  post?: Maybe<Post>;
  posts: Array<Post>;
  users: Array<User>;
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};

export type RegisterParams = {
  nick_name: Scalars['String'];
  password: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  nick_name: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularUserFragment = { __typename?: 'User', id: number, nick_name: string, createdAt: string };

export type LoginMutationVariables = Exact<{
  options: RegisterParams;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, nick_name: string, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegistrationMutationVariables = Exact<{
  options: RegisterParams;
}>;


export type RegistrationMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, nick_name: string, createdAt: string } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, nick_name: string, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  nick_name
  createdAt
}
    `;
export const LoginDocument = gql`
    mutation Login($options: RegisterParams!) {
  login(options: $options) {
    user {
      ...RegularUser
    }
    errors {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegistrationDocument = gql`
    mutation Registration($options: RegisterParams!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegistrationMutation() {
  return Urql.useMutation<RegistrationMutation, RegistrationMutationVariables>(RegistrationDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    user {
      ...RegularUser
    }
    errors {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};