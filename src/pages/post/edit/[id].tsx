import { Box, Button, useToast } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import { withUrqlClient } from 'src/utils/createUrqlClient';
import { authorizedGuard } from 'src/utils/next';
import useGetPost from 'src/hooks/useGetPost';
import { InputField } from 'src/components/atoms/InputField';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { PostDocument, useUpdatePostMutation } from 'src/generated/graphql';

const EditPost = () => {
  const toast = useToast();
  const { query } = useRouter();
  const postId = Number(query?.id);
  const [{ data, fetching }] = useGetPost();
  const [{}, updatePost] = useUpdatePostMutation();

  const initialValues = {
    title: data?.post?.title || '',
    text: data?.post?.text || ''
  };

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        onSubmit={async(values) => {
          const { error } = await updatePost({ id: postId, ...values });

          if (!error) {
            toast({
              description: 'Post was edited',
              status: 'success',
              duration: 2000,
              isClosable: true
            });
          }
        }}
      >
        {() => (
          <Form>
            <Box mt={4}>
              <InputField
                label="Title"
                name="title"
                placeholder="Title"
              />
            </Box>
            <Box mt={4}>
              <InputField
                isTextArea
                label="Text"
                name="text"
                placeholder="Text"
              />
            </Box>
            <Button
              mt={4}
              variant="solid"
              colorScheme="linkedin"
              isLoading={fetching}
              type="submit"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export const getServerSideProps = authorizedGuard(async(client, ctx) => {
  await client.query(PostDocument, { id: Number(ctx?.query?.id) }, ctx).toPromise();
});

export default withUrqlClient(EditPost);
