import { Box, Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { Formik, Form } from 'formik';

import { createUrqlClient } from 'src/utils/createUrqlClient';
import { InputField } from 'src/components/atoms/InputField';
import { Wrapper } from 'src/components/template/Wrapper/Wrapper';
import { useForgotPasswordMutation } from 'src/generated/graphql';

function ForgotPassword() {
  const [{ fetching }, frogotPassword] = useForgotPasswordMutation();
  const toast = useToast();

  const initialValues = {
    email: ''
  };

  const handleForgotPassword = async(values: typeof initialValues) => {
    const { data } = await frogotPassword(values);

    if (data?.forgotPassword) {
      toast({
        description: 'Something went wrong',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    } else {
      toast({
        description: 'Please check an email',
        status: 'success',
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={handleForgotPassword}
      >
        {() => (
          <Form>
            <Box mt={4}>
              <InputField
                label="Email"
                name="email"
                placeholder="Enter an email"
              />
            </Box>
            <Button
              mt={4}
              variant="solid"
              colorScheme="linkedin"
              isLoading={fetching}
              type="submit"
            >
              Restore Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);
