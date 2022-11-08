import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

const NavBar = dynamic(() => import('src/components/molecules/NavBar'), {
  ssr: false
});

interface Props {
  children: React.ReactNode;
  variant?: 'small' | 'regular'
}

export const Wrapper: React.FC<Props> = ({ children, variant = 'regular' }) => {
  return (
    <>
      <NavBar />
      <Box mt={8} mx="auto" maxW={variant === 'regular' ? '800px' : '400px'} w="100%">
        {children}
      </Box>
    </>
  );
};
