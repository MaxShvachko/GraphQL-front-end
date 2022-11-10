import { Flex, Heading, Stack, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { POSTS_LIMIT } from 'src/constants/api';
import { withUrqlClient } from 'src/utils/createUrqlClient';
import { authorizedGuard } from 'src/utils/next';
import { Post } from 'src/components/atoms/Post';

import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { PostsDocument, usePostsQuery } from 'src/generated/graphql';

const Home = () => {
  const [cursor, setCursor] = useState<string>();
  const [{ data, fetching }] = usePostsQuery({ variables: { limit: POSTS_LIMIT, cursor } });

  const handleLoadMore = () => setCursor(data?.posts.data[data?.posts.data.length - 1].createdAt);

  return (
    <Wrapper>
      <Flex mb={5} align="center">
        <Heading>LiReddit</Heading>
      </Flex>
      {!data?.posts.data && fetching && (
        <div>Loading...</div>
      )}
      {data?.posts.data.map((post) => (
        <Stack key={post.id} spacing={8} direction="column">
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
  );
};

export const getServerSideProps = authorizedGuard(async(client, ctx) => {
  await client.query(PostsDocument, { limit: POSTS_LIMIT }, ctx).toPromise();
});

export default withUrqlClient(Home);
