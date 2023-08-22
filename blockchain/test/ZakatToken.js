const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("ZakatToken", function () {
    async function deployZakatTokenFixture() {
        // Contracts are deployed using the first signer/account by default
        const [deployer, defaultZakatWallet, user] = await ethers.getSigners();

        const ZakatToken = await ethers.getContractFactory("ZakatToken");
        const token = await ZakatToken.deploy("Zakat", "ZAKAT", defaultZakatWallet.address);

        return {deployer, token, defaultZakatWallet, user};
    }

    describe("Deployment", function () {
        it("Should set the defaultZakatAddress", async function () {
            const {token, defaultZakatWallet} = await loadFixture(deployZakatTokenFixture);

            expect(await token.defaultZakatAddress()).to.equal(defaultZakatWallet.address);
        });

        it("Should set transfer with fee", async function () {
            const {deployer, token, user} = await loadFixture(deployZakatTokenFixture);

            expect(await token.balanceOf(deployer.address)).to.equal(ethers.parseEther("1000"));

            // TODO: test transfer with fee
            await token.transfer(user.address, ethers.parseEther("100"));
            expect(await token.balanceOf(deployer.address)).to.equal(ethers.parseEther("900"));
            expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther("97.5"));

        });
    });

});
