import { Link, Input, Button, Text, Heading, Stack, Box } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";
import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from '../../artifacts/contracts/Greeter.sol/Greeter.json';

// this is from ropsten testnet
const greeterAddress = '0x9443bEE8a6969DB5611F8460289fB56927b0075b';
// these are local deployed contracts.
// const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function GreeterPage() {
  const [greetingInput, setGreetingValueInput] = useState('');
  const [greeting, setGreetingValue] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchGreeting() {
    // looking for Metamask on the browser
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider); // create an instance of the contract

      try {
        const data = await contract.greet();
        setGreetingValue(data);
        console.log('data: ', data);
      }
      catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function setGreeting() {
    if (!greetingInput) {
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount(); // wait for the users to connect to their wallet

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(); // to create a transaction, we need a signer
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer); // create an instance of the contract with a signer
      const transaction = await contract.setGreeting(greetingInput);

      setGreetingValueInput('');

      await transaction.wait(); // waiting for transaction to be confirmed

      fetchGreeting();
    }
  }

  return (
    <Box>
      <Heading>Greeter Contract</Heading>
      <Stack alignContent={'flex-start'} mt={5}>
        <Stack direction={'row'}>
          <Button colorScheme='teal' maxWidth={'200px'} onClick={setGreeting}>Set Greeting</Button>
          <Input
            shadow={'md'}
            onChange={e => setGreetingValueInput(e.target.value)}
            placeholder='Set greeting'
            value={greetingInput}
            size={'md'}
            maxWidth={'200px'}
          />
        </Stack>

        <Stack direction={'row'}>
          <Button colorScheme='teal' maxWidth={'150px'} onClick={fetchGreeting}>Fetch Greeting</Button>
          <Text alignSelf={'center'}>{greeting}</Text>
        </Stack>
      </Stack>

      <br /><br />

      <Link as={RouterLink} textDecorationLine={'underline'} to='/sbtoken'>Smooth Brain Token</Link>
    </Box>
  );
}

export default GreeterPage;