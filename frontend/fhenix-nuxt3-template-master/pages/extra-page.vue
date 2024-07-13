<template>
  <div class="main">
    <div class="content">
      <h1>Manage your Will</h1>
      <div class="address"><b>Connected Wallet Address:</b> {{ address }}</div>
      <div class="encrypt-form">
        <div class="form-group">
          <label for="beneficiaryAddress">Beneficiary Address</label>
          <input ref="txtBeneficiaryAddress" id="beneficiaryAddress" class="form-control" type="text" placeholder="Enter Beneficiary Address" />
        </div>
        <div class="form-group">
          <label for="tokenAddress">Token Address</label>
          <input ref="txtTokenAddress" id="tokenAddress" class="form-control" type="text" placeholder="Enter Token Address" />
        </div>
        <div class="form-group">
          <label for="percentage">Percentage</label>
          <input ref="txtPercentage" id="percentage" class="form-control" type="number" placeholder="Enter Percentage" />
        </div>
        <button class="btn btn-primary" @click="encryptAddresses">Encrypt</button>
        <button class="btn btn-primary" @click="storeBeneficiariesOnClick">Store Beneficiaries</button>
        <button class="btn btn-primary" @click="distributeInheritance">Distribute Inheritance</button>
      </div>
      <div class="results">
        <div class="result-box" v-if="encryptedBeneficiaryAddress !== ''">
          <h3>Encrypted Beneficiary Address</h3>
          <div class="result-content">{{ encryptedBeneficiaryAddress }}</div>
        </div>
        <div class="result-box" v-if="encryptedTokenAddress !== ''">
          <h3>Encrypted Token Address</h3>
          <div class="result-content">{{ encryptedTokenAddress }}</div>
        </div>
        <div class="result-box" v-if="encryptedPercentage !== ''">
          <h3>Encrypted Percentage</h3>
          <div class="result-content">{{ encryptedPercentage }}</div>
        </div>
      </div>
      <button class="btn btn-secondary" @click="navigateToPage('/')">Go to Home</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
const { navigateToPage } = useCommon();

const txtBeneficiaryAddress = ref(null);
const txtTokenAddress = ref(null);
const txtPercentage = ref(null);
const { address, storeBeneficiaries } = useChain();
const { encrypt, encrypt_address, encryptedText } = useFHE();

const encryptedBeneficiaryAddress = ref('');
const encryptedTokenAddress = ref('');
const encryptedPercentage = ref('');

const encryptAddresses = async () => {
  const beneficiaryAddress = txtBeneficiaryAddress.value;
  const tokenAddress = txtTokenAddress.value;
  const percentage = txtPercentage.value;

  if (beneficiaryAddress && tokenAddress && percentage) {
    await encrypt_address(beneficiaryAddress);
    if (encryptedText.value !== '') {
      encryptedBeneficiaryAddress.value = encryptedText.value;
      encryptedText.value = ''; // Reset encryptedText

      await encrypt_address(tokenAddress);
      if (encryptedText.value !== '') {
        encryptedTokenAddress.value = encryptedText.value;
        encryptedText.value = ''; // Reset encryptedText

        await encrypt(percentage);
        if (encryptedText.value !== '') {
          encryptedPercentage.value = encryptedText.value;
          encryptedText.value = ''; // Reset encryptedText
        }
      }
    }
  }
};

const storeBeneficiariesOnClick = async () => {
  console.log("storeBeneficiaries called")
  const beneficiaryAddress = txtBeneficiaryAddress.value;
  const tokenAddress = txtTokenAddress.value;
  const percentage = txtPercentage.value;

  storeBeneficiaries(beneficiaryAddress.value, tokenAddress.value, parseInt(percentage.value))
}

// const storeBeneficiaries = async () => {
//   if (encryptedBeneficiaryAddress.value && encryptedTokenAddress.value && encryptedPercentage.value) {
//     const addresses = [encryptedBeneficiaryAddress.value];
//     const tokenAddresses = [encryptedTokenAddress.value];
//     const percentages = [encryptedPercentage.value];
//     const tx = await contract.storeBeneficiaries(addresses, tokenAddresses, percentages);
//     await tx.wait();
//     alert('Beneficiaries stored successfully!');
//   } else {
//     alert('Please encrypt all fields before storing beneficiaries.');
//   }
// };

// const distributeInheritance = async () => {
//   const tx = await contract.distributeInheritance();
//   await tx.wait();
//   alert('Inheritance distributed successfully!');
// };
</script>

<style scoped>
/* Global Styles */
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  color: #e0e0e0;
  overflow-y: scroll; /* Ensure body allows scrolling */
}

/* Main Container */
.main {
  display: flex;
  justify-content: center;
  align-items: center; /* Center content vertically */
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.content {
  background-color: #202020;
  color: #e0e0e0;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* Address Display */
.address {
  margin-bottom: 30px;
  font-size: 1.2em;
}

/* Form Styles */
.encrypt-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form-group label {
  margin-bottom: 5px;
  font-size: 1em;
  color: #5a67d8;
}

.form-control {
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #444;
  background-color: #2a2a2a;
  color: #e0e0e0;
  font-size: 1em;
}

/* Button Styles */
.btn {
  background-color: #5a67d8;
  color: #ffffff;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn:hover {
  background-color: #434190;
  transform: translateY(-2px);
}

.btn-primary {
  margin-bottom: 20px;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* Results Styles */
.results {
  margin-top: 30px;
}

.result-box {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.result-box h3 {
  margin-top: 0;
  font-size: 1.2em;
  color: #5a67d8;
}

.result-content {
  white-space: normal;
  word-break: break-all;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
  color: #e0e0e0;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
}
</style>
