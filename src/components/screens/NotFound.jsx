import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Heading, Box } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';

const NotFound = () => (
  <Box maxW={'500px'}>
    <Heading mb={5} bgGradient={'linear(to-r, #fd1d1d, #fcb045)'} bgClip='text'>404 - Not Found</Heading>
    <Box textAlign={'center'}>
      <Link
        as={RouterLink}
        textDecorationLine={'underline'}
        to='/'
      >
        <ArrowLeftIcon /> Back
      </Link>
    </Box>
  </Box>
);

export default NotFound;
