const { expect, assert } = require('chai');
const { ethers } = require('hardhat');

describe('Greeter', function () {
  it('Should return the new greeting once it is changed', async function () {
    const Greeter = await ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, world!');
    await greeter.deployed();

    expect(await greeter.greet()).to.equal('Hello, world!');

    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});

describe('SBToken', function() {
  let Token;
  let sbtoken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory('Token');
    [owner, addr1, addr2] = await ethers.getSigners();

    sbtoken = await Token.deploy();
  })

  describe('Deployment', function() {
    it('Should have the correct owner', async () => {
      expect(await sbtoken.owner()).to.equal(owner.address);
    })

    it('Should assign the total supply of tokens to the owner', async () => {
      const sbtokenTotalSupply = await sbtoken.totalSupply();
      const ownerBalance = await sbtoken.balanceOf(owner.address);
      expect(sbtokenTotalSupply, ownerBalance);
    })

    it('Should equal the total supply of ten million tokens', async () => {
      assert.equal(await sbtoken.totalSupply(), 10000000000000000000000000);
    })
  
    /*

    it('console log owner address and balance', async () => {
      // log the deployer wallet address
      console.log('owner wallet: ', await owner.address);
  
      // log the the deployer wallet balance in eth
      let balance = await owner.getBalance();
      let formatBalance = ethers.utils.formatEther(balance);
      console.log('owner balance: ', formatBalance);
    })

    */
  })

  describe('Transactions', function() {
    it('Should transfer tokens from owner to other accounts', async () => {
      await sbtoken.transfer(addr1.address, 10);
      const addr1Balance = await sbtoken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(10);

      sbtoken.transfer(addr2.address, 20);
      const addr2Balance = await sbtoken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(20);
    })

    it('Should transfer between accounts', async () => {
      await sbtoken.transfer(addr1.address, 10);
      // We use .connect(signer) to send a transaction from another account
      await sbtoken.connect(addr1).transfer(addr2.address, 5);
      const addr2Balance = await sbtoken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(5);
    })

    it("Should fail if sender doesn't have enough tokens", async () => {
      const initialOwnerBalance = await sbtoken.balanceOf(owner.address);

      await expect(
        sbtoken.connect(addr1).transfer(owner.address, 10)
      ).to.be.revertedWith('Not enough tokens');

      expect(await sbtoken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    })

    it("Should update balances after transfers", async () => {
      const initialOwnerBalance = await sbtoken.balanceOf(owner.address);

      await sbtoken.transfer(addr1.address, 50);
      await sbtoken.transfer(addr2.address, 50);

      const finalOwnerBalance = await sbtoken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(100));

      const addr1Balance = await sbtoken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      const addr2Balance = await sbtoken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    })

    it("Should only give each wallet 10 tokens once", async () => {
      await sbtoken.connect(addr1).giveMeTenTokens();

      const addr1Balance = await sbtoken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(10);

      await expect(
        sbtoken.connect(addr1).giveMeTenTokens()
      ).to.be.revertedWith('Can only do this once.');
    })
  })

  describe('Swap', function() {
    it('Should complete the swap from Eth to Sbtoken', async () => {
      const options = {
        value: ethers.utils.parseEther('1.0')
      };

      await sbtoken.connect(addr1).swapEthForSbtoken(10, options);

      const addr1Balance = await sbtoken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(10);

      const contractEthBalance = await sbtoken.getContractEthBalance();
      console.log(contractEthBalance);
      expect(contractEthBalance).to.equal(ethers.utils.parseEther('1.0'));
    })

    it('Should fail to swap if the transaction has no Eth', async () => {
      const options = {
        value: ethers.utils.parseEther('0')
      };

      await expect(
        sbtoken.connect(addr1).swapEthForSbtoken(10, options)
      ).to.be.revertedWith("You don't have enough ETH");
    })
  })
})
