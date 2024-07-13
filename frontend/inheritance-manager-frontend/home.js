// src/Home.js
import React, { useState } from 'react';
import { FhenixClient, EncryptionTypes } from 'fhenixjs';
import InheritanceManagerContract from './contracts/InheritanceManager.json'; // Assumi che il JSON del contratto sia stato importato correttamente

const providerUrl = 'https://api.helium.fhenix.zone'; // URL del provider Fhenix

const Home = () => {
    const [encryptedAddress, setEncryptedAddress] = useState('');
    const [encryptedTokenAddress, setEncryptedTokenAddress] = useState('');
    const [encryptedPercentage, setEncryptedPercentage] = useState('');
    const [fhenixClient, setFhenixClient] = useState(null);
    const [contract, setContract] = useState(null);

    const initFhenixClient = async () => {
        try {
            // Inizializza il provider web3
            const provider = new FhenixClient({ providerUrl });
            setFhenixClient(provider);

            // Carica il contratto InheritanceManager
            const { web3 } = window;
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = InheritanceManagerContract.networks[networkId];
            const contractInstance = new web3.eth.Contract(
                InheritanceManagerContract.abi,
                deployedNetwork && deployedNetwork.address
            );
            setContract(contractInstance);

            // Rende il contratto disponibile globalmente in window
            window.contract = contractInstance;
        } catch (error) {
            console.error('Errore durante l\'inizializzazione del cliente Fhenix', error);
        }
    };

    const handleStoreBeneficiaries = async () => {
        try {
            // Crittografia dei dati con FhenixJS
            const encrypted = await fhenixClient.encrypt({
                value: encryptedAddress,
                type: EncryptionTypes.string
            });
            const encryptedToken = await fhenixClient.encrypt({
                value: encryptedTokenAddress,
                type: EncryptionTypes.string
            });
            const encryptedPercent = await fhenixClient.encrypt({
                value: encryptedPercentage,
                type: EncryptionTypes.uint8
            });

            const encryptedAddresses = [encrypted];
            const encryptedTokenAddresses = [encryptedToken];
            const encryptedPercentages = [parseInt(encryptedPercent)];

            const accounts = await web3.eth.getAccounts();
            await contract.methods
                .storeBeneficiaries(encryptedAddresses, encryptedTokenAddresses, encryptedPercentages)
                .send({ from: accounts[0] });
            
            alert('Beneficiaries stored successfully!');
        } catch (error) {
            console.error('Errore durante il salvataggio dei beneficiari', error);
        }
    };

    const handleDistributeInheritance = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.distributeInheritance().send({ from: accounts[0] });

            alert('Inheritance distributed successfully!');
        } catch (error) {
            console.error('Errore durante la distribuzione dell\'eredità', error);
        }
    };

    return (
        <div>
            <h1>Inheritance Manager</h1>
            <div>
                <label>Encrypted Address:</label>
                <input
                    type="text"
                    value={encryptedAddress}
                    onChange={(e) => setEncryptedAddress(e.target.value)}
                />
            </div>
            <div>
                <label>Encrypted Token Address:</label>
                <input
                    type="text"
                    value={encryptedTokenAddress}
                    onChange={(e) => setEncryptedTokenAddress(e.target.value)}
                />
            </div>
            <div>
                <label>Encrypted Percentage:</label>
                <input
                    type="text"
                    value={encryptedPercentage}
                    onChange={(e) => setEncryptedPercentage(e.target.value)}
                />
            </div>
            <button onClick={handleStoreBeneficiaries}>Store Beneficiaries</button>
            <button onClick={handleDistributeInheritance}>Distribute Inheritance</button>
        </div>
    );
};

export default Home;
