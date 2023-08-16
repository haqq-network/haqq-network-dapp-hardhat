const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {expect} = require("chai");

describe("ZakatToken", function () {
    async function deployZakatTokenFixture() {
        // Contracts are deployed using the first signer/account by default
        const [deployer, defaultZakatWallet] = await ethers.getSigners();

        const ZakatToken = await ethers.getContractFactory("ZakatToken");
        const token = await ZakatToken.deploy("Zakat", "ZAKAT", defaultZakatWallet.address);

        return {deployer, token, defaultZakatWallet};
    }

    describe("Deployment", function () {
        it("Should set the defaultZakatAddress", async function () {
            const {token, defaultZakatWallet} = await loadFixture(deployZakatTokenFixture);

            expect(await token.defaultZakatAddress()).to.equal(defaultZakatWallet.address);
        });

        it("Should set transfer with fee", async function () {
            const {deployer, token, defaultZakatWallet} = await loadFixture(deployZakatTokenFixture);

            expect(await token.balanceOf(deployer.address)).to.equal(ethers.parseEther("1000"));

            // TODO: test transfer with fee
        });
    });

});
