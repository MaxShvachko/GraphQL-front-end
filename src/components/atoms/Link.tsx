import LinkNext from 'next/link';
import { ColorProps, Link as ChackraLink } from '@chakra-ui/react';
import { Url } from 'url';

interface Props {
  children: React.ReactNode;
  href: Url | string;
  textColor?: ColorProps['textColor'];
}

const Link = ({
  href,
  children,
  textColor = 'cyan.100'
}: Props) => {
  return (
    <ChackraLink alignItems="center" display="flex" textColor={textColor} mr={4}>
      <LinkNext href={href}>
        {children}
      </LinkNext>
    </ChackraLink>
  );
};

export default Link;
