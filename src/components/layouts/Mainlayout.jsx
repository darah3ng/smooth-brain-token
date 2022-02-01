import { Flex } from '@chakra-ui/react';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '90vh', background: '#fff', color: '#000' }}>
      <Flex
        direction='column'
        align='center'
        maxW={{ xl: '1200px' }}
        m='0 auto'
      >
        {children}
      </Flex>
    </div>
  );
};

export default Layout;
