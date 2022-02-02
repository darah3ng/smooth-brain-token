import { Flex, Box } from '@chakra-ui/react';

const Layout = ({ children }) => {
  return (
    <Box minH={'90vh'} mt={12}>
      <Flex
        direction='column'
        align='center'
        maxW={{ xl: '1200px' }}
        m='0 auto'
      >
        {children}
      </Flex>
    </Box>
  );
};

export default Layout;
