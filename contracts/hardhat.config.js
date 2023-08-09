require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");

require("dotenv").config({path: ".env"});

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        haqq: {
            url: "https://rpc.eth.haqq.network",
            accounts: [PRIVATE_KEY]
        },
        testedge: {
            url: "https://rpc.eth.testedge2.haqq.network",
            accounts: [PRIVATE_KEY]
        }
    },
    gasReporter: {
        currency: 'USD',
        gasPrice: 32,
        enabled: true,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    }
};
