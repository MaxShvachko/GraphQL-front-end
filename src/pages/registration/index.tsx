import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';

import { formatErrors } from 'src/utils/formatErrors';
import { createUrqlClient } from 'src/utils/createUrqlClient';
import { InputField } from 'src/components/atoms/InputField';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { useRegistrationMutation } from 'src/generated/graphql';

const Register = () => {
  const [{ fetching }, registration] = useRegistrationMutation();

  const initialValues = {
    email: '',
    nick_name: '',
    password: ''
  };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async(values, { setErrors }) => {
          const { data } = await registration({ options: values });
          if (data?.register.errors) {
            setErrors(formatErrors(data?.register.errors));
          }
        }}
      >
        {() => (
          <Form>
            <Box mt={4}>
              <InputField
                label="Email"
                name="email"
                placeholder="Email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                label="Nick Name"
                name="nick_name"
                placeholder="Nick Name"
              />
            </Box>
            <Box mt={4}>
              <InputField
                label="Password"
                name="password"
                placeholder="Password"
              />
            </Box>
            <Button
              mt={4}
              variant="solid"
              colorScheme="linkedin"
              isLoading={fetching}
              type="submit"
            >
              Registration
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
