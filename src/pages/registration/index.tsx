import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import { withUrqlClient } from 'next-urql';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { InputField } from 'src/components/atoms/InputField';
import { useRegistrationMutation } from 'src/generated/graphql';
import { formatErrors } from 'src/utils/formatErrors';
import { createUrqlClient } from 'src/utils/createUrqlClient';

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

export default withUrqlClient(createUrqlClient)(Register)

