import React, { useState, useEffect } from 'react';
import { FhenixClient, EncryptionTypes } from 'fhenixjs';
import { BrowserProvider, JsonRpcProvider } from 'ethers';
import './App.css'; // Importo il file CSS per lo stile
let ethersProvider; // Provider ethers

const App = () => {
  const [beneficiaries, setBeneficiaries] = useState([]); // Stato per la lista dei beneficiari
  const [encryptedAddress, setEncryptedAddress] = useState(''); // Stato per singolo beneficiario: Indirizzo criptato
  const [encryptedTokenAddress, setEncryptedTokenAddress] = useState(''); // Stato per singolo beneficiario: Indirizzo del token criptato
  const [encryptedPercentage, setEncryptedPercentage] = useState(''); // Stato per singolo beneficiario: Percentuale criptata
  const [walletConnected, setWalletConnected] = useState(false); // Stato di connessione del wallet
  const [account, setAccount] = useState(''); // Indirizzo dell'account Metamask connesso
  const provider = new JsonRpcProvider('https://api.helium.fhenix.zone');
  const client = new FhenixClient({ provider });

  useEffect(() => {
    // connectWallet(); // Connessione al wallet al caricamento della pagina
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Connessione al wallet Metamask
        ethersProvider = new BrowserProvider(window.ethereum);

        // Richiedi l'autorizzazione per accedere agli account Metamask
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Imposta lo stato di connessione del wallet e l'account connesso
        setWalletConnected(true);
        const accounts = await ethersProvider.listAccounts();
        setAccount(accounts[0]);

        // Inizializza il client Fhenix con il provider di ethers
        const client = new FhenixClient({
          provider: ethersProvider
        });
        setFhenixClient(client);
      } else {
        console.error('Install Metamask to use this application');
      }
    } catch (error) {
      console.error('Errore durante la connessione al wallet e l\'inizializzazione del cliente Fhenix', error);
    }
  };

  const handleAddBeneficiary = async () => {
    if (client && encryptedAddress && encryptedTokenAddress && encryptedPercentage) {
      try {
        const encAddress = await client.encrypt("1", EncryptionTypes.address);
        const encTokenAddress = await client.encrypt(2, EncryptionTypes.address);
        const encPercentage = await client.encrypt(parseInt(3), EncryptionTypes.uint32);

        const newBeneficiary = {
          encryptedAddress: encAddress.toString(), // Convert to string
          encryptedTokenAddress: encTokenAddress.toString(), // Convert to string
          encryptedPercentage: encPercentage.toString() // Convert to string
        };
        setBeneficiaries([...beneficiaries, newBeneficiary]);

        // Resetta i campi di input
        setEncryptedAddress('');
        setEncryptedTokenAddress('');
        setEncryptedPercentage('');
      } catch (error) {
        console.error('Errore durante la crittografia dei dati', error);
      }
    } else {
      alert('Per favore, completa tutti i campi per aggiungere un beneficiario.');
    }
  };

  const handleStoreBeneficiaries = async () => {
    try {
      // Simula il salvataggio dei beneficiari
      console.log('Beneficiaries stored:', beneficiaries);
      alert('Beneficiaries stored successfully!');
    } catch (error) {
      console.error('Errore durante il salvataggio dei beneficiari', error);
    }
  };

  const handleDistributeInheritance = async () => {
    try {
      // Simula la distribuzione dell'eredità
      console.log('Inheritance distributed');
      alert('Inheritance distributed successfully!');
    } catch (error) {
      console.error('Errore durante la distribuzione dell\'eredità', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>Inheritance Manager</h1>
          <div className="wallet-button-container">
            {!walletConnected && (
              <button className="btn" onClick={connectWallet}>Connect Wallet</button>
            )}
            {walletConnected && (
              <p>Connected Account: {account}</p>
            )}
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="container">
          <div className="form-container">
            <div className="form-group">
              <label>Encrypted Address:</label>
              <input
                type="text"
                value={encryptedAddress}
                onChange={(e) => setEncryptedAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Encrypted Token Address:</label>
              <input
                type="text"
                value={encryptedTokenAddress}
                onChange={(e) => setEncryptedTokenAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Encrypted Percentage:</label>
              <input
                type="text"
                value={encryptedPercentage}
                onChange={(e) => setEncryptedPercentage(e.target.value)}
              />
            </div>
            <button className="btn" onClick={handleAddBeneficiary}>Add Beneficiary</button>
          </div>

          <div className="beneficiaries-list">
            <h2>Beneficiaries List</h2>
            <ul>
              {beneficiaries.map((beneficiary, index) => (
                <li key={index} className="beneficiary-item">
                  <div className="tooltip">
                    <span className="tooltiptext">
                      Encrypted Address: {beneficiary.encryptedAddress}<br />
                      Encrypted Token Address: {beneficiary.encryptedTokenAddress}<br />
                      Encrypted Percentage: {beneficiary.encryptedPercentage}
                    </span>
                    <strong>Encrypted Address:</strong> {beneficiary.encryptedAddress}<br />
                    <strong>Encrypted Token Address:</strong> {beneficiary.encryptedTokenAddress}<br />
                    <strong>Encrypted Percentage:</strong> {beneficiary.encryptedPercentage}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="actions">
            <button className="btn" onClick={handleStoreBeneficiaries}>Store Beneficiaries</button>
            <button className="btn" onClick={handleDistributeInheritance}>Distribute Inheritance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
