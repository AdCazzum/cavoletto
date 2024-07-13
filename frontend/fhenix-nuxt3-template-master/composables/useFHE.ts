import { ref } from 'vue';

const { getFheClient } = useChain();

const encryptedText = ref<string>("");

export default function useFHE() {
  return { encrypt, encrypt_address, deencrypt_address, encryptedText }
}

async function encrypt_address(element: HTMLInputElement | null) {
  try {
    if (element !== null && element.value !== "") {
      const value = element.value;
      const fheClient = getFheClient();
      if (fheClient !== null) {
        // We use uint16 for the template, but you can use encrypt_uint8/16/32
        const uint8Array = (await fheClient.encrypt_address(value)).data;
        encryptedText.value = `0x${Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
      }
    }
  } catch (err: any) {
    encryptedText.value = `Error: ${err.reason}`;
  }
}

async function deencrypt_address(element: HTMLInputElement | null) {
  try {
    if (element !== null && element.value !== "") {
      const value = element.value;
      const fheClient = getFheClient();
      if (fheClient !== null) {
        const uint8Array = (await fheClient.encrypt_address(value)).data;
        encryptedText.value = `0x${Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
      }
    }
  } catch (err: any) {
    encryptedText.value = `Error: ${err.reason}`;
  }
}

async function encrypt(element: HTMLInputElement | null) {
  try {
    if (element !== null && element.value !== "") {
      const value = Number(element.value);
      const fheClient = getFheClient();
      if (fheClient !== null) {
        // We use uint16 for the template, but you can use encrypt_uint8/16/32
        const uint8Array = (await fheClient.encrypt_uint16(value)).data;
        encryptedText.value = `0x${Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('')}`;
      }
    }
  } catch (err: any) {
    encryptedText.value = `Error: ${err.reason}`;
  }
}
