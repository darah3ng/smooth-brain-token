const tokenSymbol = 'SBT';
const tokenDecimals = 18;
const tokenImage = 'https://assets.codepen.io/4625073/1.jpeg';

async function addTokenToMetaMask(tokenAddress) {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage
        }
      }
    });

    if (wasAdded) {
      console.log('Smooth Brain Token has been added.');
    } else {
      console.log('Smooth Brain Token has not been added.');
    }
  } catch (error) {
    console.log(error);
  }
}
export { addTokenToMetaMask };
