import { Flex, Button, Text } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { ROUTES } from 'src/constants/routes';
import Link from 'src/components/atoms/Link';

import { useLogoutMutation, useMeQuery } from 'src/generated/graphql';

const NavBar = () => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = <></>;

  const handleLogout = () => logout();

  if (fetching) {
    body = <Spinner />;
  } else if (!data?.me?.user) {
    body = (
      <>
        <Link href={ROUTES.LOGIN}>
          Log In
        </Link>
        <Link href={ROUTES.REGISTRATION}>
          Registration
        </Link>
        <Link href={ROUTES.FORGOT_PASSWORD}>
          Forgot Password
        </Link>
      </>);
  } else if (data?.me?.user) {
    body = (
      <>
        <Link href={ROUTES.CREATE_POST}>
          Create Post
        </Link>
        <Text lineHeight={2.5}>
          {data.me.user.nick_name}
        </Text>
        <Button isLoading={logoutFetching} ml={4} onClick={handleLogout}>
          Log Out
        </Button>
      </>
    );
  }

  return (
    <Flex
      position="sticky"
      minH="72px"
      justifyContent="space-between"
      top={0}
      zIndex={3}
      backgroundColor="tomato"
      padding={4}
      ml="auto"
    >
      <Link href={ROUTES.HOME}>
        LiReddit
      </Link>
      <Flex justifyContent="space-around">
        <Link href={ROUTES.HOME}>
          Home
        </Link>
        {body}
      </Flex>
    </Flex>
  );
};

export default NavBar;
