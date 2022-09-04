import { Flex, Button, Link, Text } from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'
import LinkNext from 'next/link';

import { ROUTES } from "src/constants/routes";
import { useLogoutMutation, useMeQuery } from "src/generated/graphql";

const NavBar = () => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = <></>;

  const handleLogout = () => logout();

  if (fetching) {
    body = <Spinner />
  } else if (!data?.me?.user) {
    body = (
    <>
      <Link textColor="cyan.100" mr={4}>
        <LinkNext href={ROUTES.LOGIN}>
          Log In
        </LinkNext>
      </Link>
      <Link textColor="cyan.100" mr={4}>
        <LinkNext href={ROUTES.REGISTRATION}>
          Registration
        </LinkNext>
      </Link>
      <Link textColor="cyan.100" mr={4}>
        <LinkNext href={ROUTES.HOME}>
          Home
       </LinkNext>
      </Link>
      <Link textColor="cyan.100" mr={4}>
        <LinkNext href={ROUTES.FORGOT_PASSWORD}>
          Forgot Password
        </LinkNext>
      </Link>
    </>)
  } else if (data?.me?.user) {
    body = (
      <>
        <Button isLoading={logoutFetching} ml={4} onClick={handleLogout}>
          Log Out
        </Button>
        <Link textColor="cyan.100" mr={4}>
          <LinkNext href={ROUTES.CREATE_POST}>
            Create Post
        </LinkNext>
      </Link>
        <Text lineHeight={2.2}>
         {data.me.user.nick_name}
        </Text>
      </>
    )
  }

  return (
    <Flex 
      position="static" 
      flexDir="row-reverse"
      top={0}
      zIndex={3}
      backgroundColor="tomato"
      padding={4}
      ml="auto"
    >
        {body}
    </Flex>
  )
}

export default NavBar;