import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import {getDefaultWallets, RainbowKitProvider} from '@rainbow-me/rainbowkit';
import type {AppProps} from 'next/app';
import {configureChains, createConfig, WagmiConfig} from 'wagmi';
import {haqqMainnet, haqqTestedge2} from 'wagmi/chains';
import {publicProvider} from 'wagmi/providers/public';

const {chains, publicClient, webSocketPublicClient} = configureChains(
    [
        haqqMainnet, haqqTestedge2
    ],
    [publicProvider()]
);

const {connectors} = getDefaultWallets({
    appName: 'Haqq Network dApp',
    projectId: 'YOUR_PROJECT_ID',
    chains,
});

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

function MyApp({Component, pageProps}: AppProps) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default MyApp;
