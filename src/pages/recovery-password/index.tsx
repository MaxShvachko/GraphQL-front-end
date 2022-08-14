import { Box, Button, useToast } from "@chakra-ui/react";
import { Formik, Form, FormikHelpers } from "formik";
import { withUrqlClient } from 'next-urql';
import { useRouter } from "next/router";

import { InputField } from "src/components/atoms/InputField";
import { Wrapper } from "src/components/template/Wrapper/Wrapper";
import { ROUTES } from "src/constants/routes";
import { formatErrors } from "src/utils/formatErrors";
import { useChangePasswordMutation } from 'src/generated/graphql';
import { createUrqlClient } from 'src/utils/createUrqlClient';

function RecoveryPassword() {
  const { push, query } = useRouter();
  const toast = useToast();
  const [{ fetching }, changePassword] = useChangePasswordMutation();

  const initialValues = {
    new_password: '',
    confirm_new_password: ''
  };

  const handleChangePassword = async(values: typeof initialValues, { setErrors }: FormikHelpers<typeof initialValues>) => {
    const { data } = await changePassword({ options: { ...values, token: query.token as string } });
    if (data?.changePassword.errors) {
      setErrors(formatErrors(data?.changePassword.errors));

      toast({
        description: data?.changePassword.errors[0].message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } else if (data?.changePassword.user) {
      push(ROUTES.HOME);
    }
  }

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={initialValues}
        onSubmit={handleChangePassword}
      >
        {() => (
          <Form>
            <Box mt={4}>
              <InputField
                label='New Password'
                name='new_password'
                placeholder='Enter a new password'
              />
            </Box>
            <Box mt={4}>
              <InputField
                label='Confirm New Password'
                name='confirm_new_password'
                placeholder='Confirm New Password'
              />
            </Box>
            <Button
              mt={4}
              variant="solid"
              colorScheme="linkedin"
              isLoading={fetching}
              type='submit'
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(RecoveryPassword)
