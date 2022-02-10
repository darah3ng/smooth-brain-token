import { Link, Input, Button, Heading, Stack, Box, useToast } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from '../../artifacts/contracts/Greeter.sol/Greeter.json';
import GreetingModal from '../ui/GreetingModal';

// this is from ropsten testnet
const greeterAddress = '0x9443bEE8a6969DB5611F8460289fB56927b0075b';
// these are local deployed contracts.
// const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function GreeterPage() {
  const [greetingInput, setGreetingValueInput] = useState('');
  const [greeting, setGreetingValue] = useState('');
  const [isInputError, setIsInputError] = useState(false);
  const [isGreetingButtonLoading, setIsGreetingButtonLoading] = useState(false);
  const toast = useToast();

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    // looking for Metamask on the browser
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider); // create an instance of the contract

      try {
        setIsGreetingButtonLoading(true);
        const data = await contract.greet();
        setIsGreetingButtonLoading(false);
        setGreetingValue(data);

        console.log('data: ', data);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function setGreeting() {
    if (!greetingInput) {
      setIsInputError(true);
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      setIsInputError(false);
      await requestAccount(); // wait for the users to connect to their wallet

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); // to create a transaction, we need a signer
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer); // create an instance of the contract with a signer
      const transaction = await contract.setGreeting(greetingInput);

      setIsGreetingButtonLoading(true);
      await transaction.wait(); // waiting for transaction to be confirmed
      setIsGreetingButtonLoading(false);

      setGreetingValue('');

      toast({
        status: 'success',
        duration: 9000,
        position: 'top',
        isClosable: true
      });

      fetchGreeting();
    }
  }

  return (
    <Box maxWidth={'500px'}>
      <Heading>Greeter Contract</Heading>
      <Stack alignContent={'flex-start'} mt={5} mb={5}>
        <Stack direction={'row'}>
          <Button colorScheme='teal' maxWidth={'200px'} onClick={setGreeting} isLoading={isGreetingButtonLoading}>Set Greeting</Button>
          <Input
            shadow={'md'}
            onChange={e => setGreetingValueInput(e.target.value)}
            placeholder='Set greeting'
            value={greetingInput}
            size={'md'}
            maxWidth={'200px'}
            isRequired
            isInvalid={isInputError}
          />
        </Stack>

        <GreetingModal
          fetchGreeting={fetchGreeting}
          greeting={greeting}
          isButtonLoading={isGreetingButtonLoading}
        />
      </Stack>

      <Link
        as={RouterLink}
        textDecorationLine={'underline'}
        to='/sbtoken'
      >
        <ArrowRightIcon /> Smooth Brain Token
      </Link>
    </Box>
  );
}

export default GreeterPage;
