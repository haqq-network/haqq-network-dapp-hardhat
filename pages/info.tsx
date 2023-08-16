import styles from "../styles/Home.module.css";
import type {NextPage} from 'next';

const Info: NextPage = () => {
    return (
        <div>
            <h1 className={styles.title}>
                Welcome to <br/> <a href="https://haqq.network/" target="_blank">HAQQ</a> + <a target="_blank"
                href="https://www.rainbowkit.com/">RainbowKit</a> + <a target="_blank" href="https://wagmi.sh">wagmi</a> +{' '}
                <a href="https://nextjs.org">Next.js!</a>
            </h1>

            <div className={styles.grid}>
                <a className={styles.card} href="https://docs.haqq.network/" target="_blank">
                    <h2>Haqq Network Documentation &rarr;</h2>
                    <p>PoS blockchain compatible with Ethereum, built using the Cosmos SDK and Tendermint Core consensus
                        engine.</p>
                </a>
                <a className={styles.card} href="https://rainbowkit.com" target="_blank">
                    <h2>RainbowKit Documentation &rarr;</h2>
                    <p>Learn how to customize your wallet connection flow.</p>
                </a>

                <a className={styles.card} href="https://wagmi.sh" target="_blank">
                    <h2>wagmi Documentation &rarr;</h2>
                    <p>Learn how to interact with Ethereum.</p>
                </a>

                <a
                    className={styles.card}
                    href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
                    target="_blank"
                >
                    <h2>RainbowKit Examples &rarr;</h2>
                    <p>Discover boilerplate example RainbowKit projects.</p>
                </a>

                <a className={styles.card} href="https://nextjs.org/docs" target="_blank">
                    <h2>Next.js Documentation &rarr;</h2>
                    <p>Find in-depth information about Next.js features and API.</p>
                </a>

                <a
                    className={styles.card}
                    target="_blank"
                    href="https://github.com/vercel/next.js/tree/canary/examples"
                >
                    <h2>Next.js Examples &rarr;</h2>
                    <p>Discover and deploy boilerplate example Next.js projects.</p>
                </a>

                <a
                    className={styles.card}
                    target="_blank"
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                >
                    <h2>Deploy &rarr;</h2>
                    <p>
                        Instantly deploy your Next.js site to a public URL with Vercel.
                    </p>
                </a>
            </div>
        </div>
    );
};

export default Info;
