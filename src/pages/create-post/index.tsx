import { Box, Button, useToast } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { GetServerSideProps } from 'next';

import { ROUTES } from 'src/constants/routes';
import { withUrqlClient } from 'src/utils/createUrqlClient';
import { InputField } from 'src/components/atoms/InputField';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { useCreatePostMutation } from 'src/generated/graphql';

const CreatePost = () => {
  const [{ data, fetching }, createPost] = useCreatePostMutation();
  const toast = useToast();

  const initialValues = {
    title: '',
    text: ''
  };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async(values, { setValues }) => {
          const { error } = await createPost({ options: values });

          if (!error) {
            toast({
              description: 'Post was created',
              status: 'success',
              duration: 9000,
              isClosable: true
            });
            setValues(initialValues);
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
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async(context) => {
  if (!context.req.cookies?.qid) {
    return {
      redirect: {
        destination: ROUTES.LOGIN,
        permanent: false
      }
    };
  }

  return {
    props: {}
  };
};

export default withUrqlClient(CreatePost);
