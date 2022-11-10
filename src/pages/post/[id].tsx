import { useRouter } from 'next/router';

import { withUrqlClient } from 'src/utils/createUrqlClient';
import { PostDocument, usePostQuery } from 'src/generated/graphql';
import { authorizedGuard } from 'src/utils/next';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { Box, Heading } from '@chakra-ui/react';

const Post = () => {
  const { query } = useRouter();
  const postId = Number(query?.id);

  const [{ data, error, fetching }] = usePostQuery({ variables: { id: postId }, pause: !postId });
  return (
    <Wrapper>
      {fetching && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {Boolean(data?.post)
        ? (
          <Box>
            <Heading mb={5}>{data?.post?.title}</Heading>
            <Box>{data?.post?.text}</Box>
          </Box>
        )
        : <Box>Could not find post</Box>
      }
    </Wrapper>
  );
};

export const getServerSideProps = authorizedGuard(async(client, ctx) => {
  await client.query(PostDocument, { id: Number(ctx?.params?.id) }, ctx).toPromise();
});

export default withUrqlClient(Post);
