import { Flex, Heading, Stack, Link, Button } from "@chakra-ui/react";
import { Post } from "src/components/atoms/Post";
import { useState } from "react";
import LinkNext from 'next/link';

import { Wrapper } from "src/components/template/Wrapper/Wrapper"
import { PostsDocument, usePostsQuery } from 'src/generated/graphql';
import { withUrqlClient } from 'src/utils/createUrqlClient';
import { authorizedGuard,  } from 'src/utils/next';
import { ROUTES } from "src/constants/routes";
import { POSTS_LIMIT } from "src/constants/api";

const Home = () => {
  const [cursor, setCursor] = useState<string>();
  const [{ data, fetching }] = usePostsQuery({ variables: { limit: POSTS_LIMIT, cursor } });

  const handleLoadMore = () => setCursor(data?.posts.data[data?.posts.data.length - 1].createdAt);

  return (
    <Wrapper>
      <Flex mb={5} align="center">
        <Heading>LiReddit</Heading>
        <LinkNext target="_blank" href={ROUTES.CREATE_POST}>
          <Link margin='auto' textColor="MenuText" mr={4}>
            Create Post
          </Link>
        </LinkNext>
      </Flex>
      {!data?.posts.data && fetching && (
        <div>Loading...</div>
      )}
      {data?.posts.data.map((post) => (
        <Stack key={post.id} spacing={8} direction='column'>
          <Post {...post} />
        </Stack>
      ))}
      {data?.posts && (
        <Flex>
          <Button disabled={!data.posts.hasMore} onClick={handleLoadMore} isLoading={fetching} m="auto" my={4}>
            Load More
          </Button>
      </Flex>
      )}
    </Wrapper>
  )
}

export const getServerSideProps = authorizedGuard(async(client, ctx) => {
  await client.query(PostsDocument, { limit: POSTS_LIMIT, cursor: null }, ctx).toPromise();
});

export default withUrqlClient(Home);
