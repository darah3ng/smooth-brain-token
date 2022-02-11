import { useEffect } from 'react';
import { Flex, Box, useColorMode } from '@chakra-ui/react';
import customTheme from '../../theme/customTheme';

const Layout = ({ children }) => {
  const { colorMode, setColorMode } = useColorMode();

  // set dark mode by default
  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

  const brandColorTheme = customTheme.colors.mode[colorMode || 'light'];

  return (
    <Box minH={'90vh'} mt={12} background={brandColorTheme}>
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
