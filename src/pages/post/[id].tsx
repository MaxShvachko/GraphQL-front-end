import { Box, Flex, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { withUrqlClient } from 'src/utils/createUrqlClient';
import { authorizedGuard } from 'src/utils/next';
import useGetPost from 'src/hooks/useGetPost';
import PostButtons from 'src/components/molecules/PostButtons';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { PostDocument } from 'src/generated/graphql';

const Post = () => {
  const { query } = useRouter();
  const postId = Number(query.id);
  const [{ data, error, fetching }] = useGetPost();
  return (
    <Wrapper>
      {fetching && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {Boolean(data?.post)
        ? (
          <Flex>
            <Box>
              <Heading mb={5}>{data?.post?.title}</Heading>
              <Box>{data?.post?.text}</Box>
            </Box>
            <PostButtons id={postId} />
          </Flex>
        )
        : <Box>Could not find post</Box>
      }
    </Wrapper>
  );
};

export const getServerSideProps = authorizedGuard(async(client, ctx) => {
  await client.query(PostDocument, { id: Number(ctx?.query?.id) }, ctx).toPromise();
});

export default withUrqlClient(Post);
