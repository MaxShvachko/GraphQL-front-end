import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { Wrapper } from '../../components/template/Wrapper/Wrapper';
import { InputField } from '../../components/atoms/InputField';
import { useLoginMutation } from '../..//generated/graphql';
import { formatErrors } from 'src/utils/formatErrors';
import { useRouter } from 'next/router';
import { ROUTES } from 'src/constants/routes';

interface Props {

}

const Login = ({}: Props) => {
  const { push } = useRouter();
  const [{ fetching }, login] = useLoginMutation();

  const initialValues = {
    nick_name: '',
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
        {({ values, isSubmitting }) => (
          <Form>
            <Box mt={4}>
            <InputField
              label='Nick Name'
              name='nick_name'
              placeholder='Nick Name'
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

export default Login

