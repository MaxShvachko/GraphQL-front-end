import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { Wrapper } from '../../components/template/Wrapper/Wrapper';
import { InputField } from '../../components/atoms/InputField';
import { useMutation } from 'urql';
import { useRegistrationMutation } from 'src/generated/graphql';
import { formatErrors } from 'src/utils/formatErrors';

interface Props {

}

const Register = ({}: Props) => {
  const [{ data, fetching }, registration] = useRegistrationMutation();

  const initialValues = {
    nick_name: '',
    password: ''
  };

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={initialValues}
        onSubmit={async(values, { setErrors }) => {
          const { data } = await registration({ options: values });
          if (data?.register.errors) {
            setErrors(formatErrors(data?.register.errors))
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
              Registration
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register

