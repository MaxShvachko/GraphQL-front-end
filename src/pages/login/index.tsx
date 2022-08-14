import { Box, Button } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { InputField } from 'src/components/atoms/InputField';
import { useLoginMutation } from 'src/generated/graphql';
import { formatErrors } from 'src/utils/formatErrors';
import { useRouter } from 'next/router';
import { ROUTES } from 'src/constants/routes';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from 'src/utils/createUrqlClient';

const Login = () => {
  const { push } = useRouter();
  const [{ fetching }, login] = useLoginMutation();

  const initialValues = {
    email: '',
    password: ''
  };

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={initialValues}
        onSubmit={async(values, { setErrors }) => {
          const { data } = await login({ options: values });
          if (data?.login.errors) {
            setErrors(formatErrors(data?.login.errors));
          } else if (data?.login.user) {
            push(ROUTES.HOME);
          }
        }}
      >
        {() => (
          <Form>
            <Box mt={4}>
              <InputField
                label='Email'
                name='email'
                placeholder='Email'
              />
            </Box>
            <Box mt={4}>
              <InputField
                label='Password'
                name='password'
                placeholder='Password'
              />
            </Box>
            <Button
              mt={4}
              variant="solid"
              colorScheme="linkedin"
              isLoading={fetching}
              type='submit'
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login)
