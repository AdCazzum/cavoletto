pragma solidity ^0.8.20;

import "fhevm@v0.3.0/lib/TFHE.sol";
import "fhevm@v0.3.0/abstracts/EIP712WithModifier.sol";

contract InheritanceManager is EIP712WithModifier {
    address public owner;
    euint32[] public encryptedBeneficiaries;
    euint32[] public encryptedPercentages;
    uint32[] public beneficiaries;
    uint32[] public percentages;

    constructor() EIP712WithModifier("Authorization token", "1") {
        owner = msg.sender;
    }

    function storeBeneficiary(bytes calldata encryptedBeneficiary, bytes calldata encryptedPercentage) public {
        require(msg.sender == owner, "Only owner can store beneficiaries");
        encryptedBeneficiaries.push(TFHE.asEuint32(encryptedBeneficiary));
        encryptedPercentages.push(TFHE.asEuint32(encryptedPercentage));
    }

    //distribuzione
    //per ogni token beneficiario e percentuale - verifica il balance dell'owner, 
    //calcola la percentuale del balance token/100*balance (usando le funzioni nohomo)
    //trasferisci dall'owner al beneficiario la quantità

    //

    // function decryptBeneficiaries() public {
    //     require(msg.sender == owner, "Only owner can decrypt beneficiaries");
    //     for (uint256 i = 0; i < encryptedBeneficiaries.length; i++) {
    //         beneficiaries.push(TFHE.decrypt(encryptedBeneficiaries[i]));
    //     }
    // }

    // function decryptPercentages() public {
    //     require(msg.sender == owner, "Only owner can decrypt percentages");
    //     for (uint256 i = 0; i < encryptedPercentages.length; i++) {
    //         percentages.push(TFHE.decrypt(encryptedPercentages[i]));
    //     }
    // }

    // function getBeneficiaries() public view returns (uint32[] memory) {
    //     return beneficiaries;
    // }

    // function getPercentages() public view returns (uint32[] memory) {
    //     return percentages;
    // }
}
