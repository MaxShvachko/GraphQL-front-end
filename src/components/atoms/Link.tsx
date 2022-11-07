import LinkNext from 'next/link';
import { Link as ChackraLink } from "@chakra-ui/react";
import { Url } from 'url';

interface Props {
  children: React.ReactNode;
  href: Url | string
}

const Link = ({ children, href}: Props) => {
  return (
    <ChackraLink alignItems="center" display="flex" textColor="cyan.100" mr={4}>
      <LinkNext href={href}>
        {children}
      </LinkNext>
    </ChackraLink>
  )
}

export default Link;
