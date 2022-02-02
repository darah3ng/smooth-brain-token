import { useToast } from '@chakra-ui/react';

function Toast() {
  const toast = useToast()
  return (
    toast({
      title: 'Greet creation.',
      description: "Greet has just been set.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  )
}

export default Toast;