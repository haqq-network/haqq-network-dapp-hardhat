import type {NextPage} from 'next';
import {useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from 'wagmi'
import {abi, contractAddress} from './abi/ZakatToken.json'
import {useState} from "react";
import {useDebounce} from 'use-debounce';
import {formatEther, parseEther} from 'viem'
import styles from "../styles/Home.module.css";

const Contract: NextPage = () => {
    const {address: connectedAddress} = useAccount();

    const [transferAddress, setTransferAddress] = useState();
    const [debouncedTo] = useDebounce(transferAddress, 500)

    const [transferAmount, setTransferAmount] = useState();
    const [debouncedAmount] = useDebounce(transferAmount, 500)

    const [zakatRecipient, setZakatRecipient] = useState();
    const [debouncedZakatRecipient] = useDebounce(zakatRecipient, 500)


    // Read the percentage of Zakat that is distributed to charity
    const {data: percentage} = useContractRead(
        {
            // @ts-ignore
            address: contractAddress,
            abi: abi,
            functionName: 'zakatPercentage'
        }
    );

    // Read the charity address
    const {data: currentZakatRecipient} = useContractRead(
        {
            // @ts-ignore
            address: contractAddress,
            abi: abi,
            functionName: 'getUserZakatRecipient',
            args: [connectedAddress],
            watch: true
        }
    );

    // Read the token balance
    const {data: tokenBalance} = useContractRead(
        {
            // @ts-ignore
            address: contractAddress,
            abi: abi,
            functionName: 'balanceOf',
            args: [connectedAddress],
            watch: true
        }
    );

    // Read the distributed Zakat
    const {data: distributedZakat} = useContractRead(
        {
            // @ts-ignore
            address: contractAddress,
            abi: abi,
            functionName: 'distributedZakat',
            watch: true
        }
    );

    const {config: transferConfig} = usePrepareContractWrite({
        // @ts-ignore
        address: contractAddress,
        abi: abi,
        functionName: 'transfer',
        args: [debouncedTo, debouncedAmount ? parseEther(debouncedAmount) : undefined],
    })

    const {config: zakatRecipientConfig} = usePrepareContractWrite({
        // @ts-ignore
        address: contractAddress,
        abi: abi,
        functionName: 'setUserZakatRecipient',
        args: [debouncedZakatRecipient],
    })

    const {data: transferResult, write: writeTransfer} = useContractWrite(transferConfig)
    const {data: zakatRecipientResult, write: writeZakatRecipient} = useContractWrite(zakatRecipientConfig)

    const {isLoading: isTransferLoading, isSuccess: isTransferSuccess} = useWaitForTransaction({
        hash: transferResult?.hash,
    })

    const {isLoading: isZakatLoading, isSuccess: isZakatSuccess} = useWaitForTransaction({
        hash: zakatRecipientResult?.hash,
    })

    const addTokenToMM = async () => {
        // @ts-ignore
        const result = await window.ethereum?.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: contractAddress,
                    decimals: 18,
                    name: "Zakat",
                    symbol: "ZAKAT"
                }
            }
        });
    };

    function formatPercentageString(inputString: string) {
        // Convert the input string to a number and divide by 10 to get the desired format
        const num = parseFloat(inputString) / 10;

        // Convert the number to a string with one decimal place and replace the dot with a comma
        return num.toFixed(1).replace('.', ',');
    }

    return (
        <div>
            <h3>Contract details</h3>
            <p className={styles.description}>Address: {contractAddress}</p>
            {/*@ts-ignore*/}
            <p className={styles.description}>Charity Address: {!currentZakatRecipient ? 'Loading...' : currentZakatRecipient}</p>
            <p className={styles.description}>Zakat percentage: {!percentage ? 'Loading...' : formatPercentageString(percentage.toString())}%</p>
            <p className={styles.description}>Token balance: {!tokenBalance ? '0' : formatEther(tokenBalance as bigint, "wei")} ZAKAT</p>
            <p className={styles.description}>Distributed Zakat: {!distributedZakat ? '0' : formatEther(distributedZakat as bigint, "wei")} ZAKAT</p>
            <h3>Transfer</h3>
            <input className={styles.input} placeholder="Recipient" onChange={(e) => {
                // @ts-ignore
                setTransferAddress(e.target.value);
            }}/>
            <input className={styles.input} placeholder="Amount" onChange={(e) => {
                // @ts-ignore
                setTransferAmount(e.target.value);
            }}/>
            <button className={styles.button} disabled={!writeTransfer || isTransferLoading} onClick={() => writeTransfer?.()}>
                {isTransferLoading ? 'Transferring...' : 'Transfer'}
            </button>
            {isTransferSuccess && (
                <div>
                    Successfully transferred!
                    <div>
                        <a className={styles.card} href={`https://explorer.testedge2.haqq.network/tx/${transferResult?.hash}`} target="_blank">Link
                            to explorer</a>
                    </div>
                </div>
            )}
            <h3>Set Zakat recipient</h3>
            <input className={styles.input} placeholder="Address" onChange={(e) => {
                // @ts-ignore
                setZakatRecipient(e.target.value);
            }}/>
            <button className={styles.button} disabled={!writeZakatRecipient || isZakatLoading} onClick={() => writeZakatRecipient?.()}>
                {isZakatLoading ? 'Setting...' : 'Set'}
            </button>
            {isZakatSuccess && (
                <div>
                    Successfully set!
                    <div>
                        <a className={styles.card} href={`https://explorer.testedge2.haqq.network/tx/${zakatRecipientResult?.hash}`} target="_blank">Link
                            to explorer</a>
                    </div>
                </div>
            )}
            <br/>
            <br/>
            <button className={styles.button} onClick={addTokenToMM}>Import Token</button>
        </div>
    )

}

export default Contract;