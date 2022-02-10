import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button
} from '@chakra-ui/react';

function GreetingModal({ greeting, fetchGreeting, isButtonLoading }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        isLoading={isButtonLoading}
        onClick={() => {
          fetchGreeting();
          onOpen();
        }}
        colorScheme={'orange'}
        color={'white'}
        fontWeight={'bold'}
      >
        Fetch Greeting
      </Button>

      {!isButtonLoading && (
        <Modal onClose={onClose} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>The last person said:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {greeting}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default GreetingModal;
