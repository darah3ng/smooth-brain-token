import { useState } from 'react';
import { ethers } from 'ethers';
import {
  Box, Heading, Button, Grid, GridItem, Divider, Text, Flex,
  Tag, TagLabel,
  Input, InputGroup, InputRightElement,
  useToast, useDisclosure
} from '@chakra-ui/react';
import { TriangleDownIcon } from '@chakra-ui/icons';
import BasicModal from '../ui/BasicModal';

import { TOKEN_ABI as Token, TOKEN_ADDRESS as tokenAddress } from '../../config';
import { addTokenToMetaMask } from '../../utils/addTokenToMetaMask';

function SBTokenPage() {
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);
  const [ethInput, setEthInput] = useState(0);
  const [tokenBalance, setTokenBalance] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();

  function viewToast(isError = false) {
    return toast({
      duration: 3000,
      position: 'bottom',
      isClosable: true,
      render: () => (
        <Box width={'3xs'} color='white' p={3} bg={isError ? 'red.300' : 'green.600'} borderRadius={'md'} textAlign={'center'} mb={5}>
            {isError ? 'Error' : 'Success'}
        </Box>
      )
    });
  }

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      const readableBalance = ethers.utils.formatEther(balance.toString());
      setTokenBalance(readableBalance);
    }
  }

  async function sendCoins() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
        const transaction = await contract.transfer(userAccount, ethers.utils.parseUnits(amount, 18));

        setIsLoading(true);
        await transaction.wait();
        setIsLoading(false);

        const successMessage = `${amount} Coins successfully sent to ${userAccount}`;

        viewToast();

        console.log(successMessage);
      }
    } catch (err) {
      viewToast(true);
    }
  }

  async function swapCoins() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);

        const options = {
          value: ethers.utils.parseEther(ethInput.toString())
        };
        const covertEthToSbt = ethInput * 1000;
        const transaction = await contract.swapEthForSbtoken(covertEthToSbt, options);

        setIsLoading(true);
        await transaction.wait();
        setIsLoading(false);

        console.log(`${ethInput} Eth successfully swap to ${covertEthToSbt} Sbt`);

        viewToast();
      }
    } catch (err) {
      viewToast(true);
    }
  }

  return (
    <Box maxWidth={'500px'} p={6} backgroundColor={'#274257'} borderRadius={'2xl'} boxShadow='lg'>
      <Flex flexDirection={'column'} alignItems={'center'}>
        <Heading bgGradient={'linear(to-r, #c2e59c, #64b3f4)'} bgClip='text'>Smooth Brain Token</Heading>
        <Tag size='sm' colorScheme='teal' borderRadius='full' width={'30%'} justifyContent='center'>
          <TagLabel>Ropsten Testnet</TagLabel>
        </Tag>
      </Flex>

      <Button colorScheme={'green'} size={'sm'} mt={6} onClick={() => addTokenToMetaMask(tokenAddress)}>Add token to MetaMask</Button>

      <Divider mt={5} />

      <Heading size={'md'} mt={5}>Swap</Heading>
      <Grid templateColumns='repeat(3, 1fr)' templateRows='repeat(2, 1fr)' gap={4} mt={3} mb={5}>
        <GridItem colSpan={3}>
          <InputGroup>
            <Input onChange={(e) => setEthInput(e.target.value)} value={ethInput} placeholder='ETH' />
            <InputRightElement children={<Text mr={5}>ETH</Text>} />
          </InputGroup>
        </GridItem>

        <GridItem colStart={2} placeSelf={'center'}>
          <TriangleDownIcon w={6} h={6} />
        </GridItem>

        <GridItem colSpan={3}>
          <InputGroup>
            <Input value={ethInput * 1000} isReadOnly placeholder='SBT' />
            <InputRightElement children={<Text mr={5}>SBT</Text>} />
          </InputGroup>
        </GridItem>

        <GridItem colStart={2}>
          <Button colorScheme={'green'} width={'100%'} onClick={swapCoins} isLoading={isLoading}>Swap</Button>
        </GridItem>
      </Grid>

      <Divider mt={5} />

      <Heading size={'md'} mt={5}>Send to others</Heading>
      <Grid templateColumns='repeat(3, 1fr)' templateRows='repeat(2, 1fr)' gap={4} mt={3} mb={5}>
        <GridItem rowSpan={2} colSpan={1} alignSelf={'center'}>
          <Button
            colorScheme={'green'}
            onClick={() => {
              getBalance();
              onOpen();
            }}
          >
            Your balance
          </Button>
        </GridItem>

        <GridItem colSpan={2}>
          <Input onChange={e => setUserAccount(e.target.value)} placeholder='Wallet address' />
        </GridItem>

        <GridItem colSpan={2}>
          <Input onChange={e => setAmount(e.target.value)} placeholder='Send amount' />
        </GridItem>

        <GridItem colStart={3}>
          <Button colorScheme={'orange'} onClick={sendCoins} isLoading={isLoading}>Send coins</Button>
        </GridItem>
      </Grid>

      <BasicModal isOpen={isOpen} onClose={onClose}>
        {tokenBalance.toString()}
      </BasicModal>
    </Box>
  );
}

export default SBTokenPage;
