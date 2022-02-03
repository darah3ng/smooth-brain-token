import { Link as RouterLink } from "react-router-dom";
import { useState } from 'react';
import { ethers } from 'ethers';
import { Box, Heading, Button, Grid, GridItem, Input, Link, Divider, Text, InputGroup, InputRightElement  } from '@chakra-ui/react';
import { ArrowLeftIcon, TriangleDownIcon } from '@chakra-ui/icons';
import Token from '../../artifacts/contracts/Token.sol/Token.json';

const tokenAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function SBTokenPage() {
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);
  const [ethInput, setEthInput] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [ account ] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log('Balance: ', balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function swapCoins() {
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
      await transaction.wait();

      console.log(`${ethInput} Eth successfully swap to ${covertEthToSbt} Sbt`);
    }
  }

  return (
    <Box maxWidth={'500px'}>
      <Heading bgGradient={'linear(to-r, #c2e59c, #64b3f4)'} bgClip='text'>Smooth Brain Token</Heading>

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
          <Button colorScheme={'green'} width={'100%'} onClick={swapCoins}>Swap</Button>
        </GridItem>
      </Grid>

      <Divider mt={5} />
      
      <Heading size={'md'} mt={5}>Send to others</Heading>
      <Grid templateColumns='repeat(3, 1fr)' templateRows='repeat(2, 1fr)' gap={4} mt={3} mb={5}>
        <GridItem rowSpan={2} colSpan={1} alignSelf={'center'}>
          <Button colorScheme={'orange'} onClick={sendCoins}>Send coins</Button>
        </GridItem>

        <GridItem colSpan={2}>
          <Input onChange={e => setUserAccount(e.target.value)} placeholder='Wallet address' />
        </GridItem>

        <GridItem colSpan={2}>
          <Input onChange={e => setAmount(e.target.value)} placeholder='Send amount' />
        </GridItem>

        <GridItem colStart={3}>
          <Button colorScheme={'green'} onClick={getBalance}>Your balance</Button>
        </GridItem>
      </Grid>

      <Link
        as={RouterLink}
        textDecorationLine={'underline'}
        to='/'
      >
        <ArrowLeftIcon /> Back
      </Link>
    </Box>
  );
}

export default SBTokenPage;