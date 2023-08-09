const {
    time, loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("ZakatToken", function () {
    async function deployZakatTokenFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner] = await ethers.getSigners();

        const ZakatToken = await ethers.getContractFactory("ZakatToken");
        const token = await ZakatToken.deploy("Zakat", "ZAKAT", owner.address);

        return {owner, token};
    }

    describe("Deployment", function () {
        it("Should set the defaultZakatAddress", async function () {
            const {owner, token} = await loadFixture(deployZakatTokenFixture);

            expect(await token.defaultZakatAddress()).to.equal(owner.address);
        });
    });

});
