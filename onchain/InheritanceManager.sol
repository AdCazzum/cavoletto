pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InheritanceManager {
    address public owner;

    struct EncryptedBeneficiary {
        eaddress encryptedAddress;
        eaddress encryptedTokenAddress;
        euint32 encryptedPercentage;
    }

    struct Beneficiary {
        address beneficiaryAddress;
        address tokenAddress;
        uint32 percentage;
    }

    EncryptedBeneficiary[] public encryptedBeneficiaries;
    Beneficiary[] public beneficiaries;

    constructor() {
        owner = msg.sender;
    }

    function storeBeneficiaries(
        eaddress[] calldata encryptedAddresses,
        eaddress[] calldata encryptedTokenAddresses,
        euint32[] calldata encryptedPercentages
    ) public {
        require(msg.sender == owner, "Only owner can store beneficiaries");
        require(
            encryptedAddresses.length == encryptedTokenAddresses.length &&
            encryptedTokenAddresses.length == encryptedPercentages.length,
            "Arrays must have the same length"
        );

        for (uint256 i = 0; i < encryptedAddresses.length; i++) {
            _storeBeneficiary(encryptedAddresses[i], encryptedTokenAddresses[i], encryptedPercentages[i]);
        }
    }

    function _storeBeneficiary(eaddress encryptedAddress, eaddress encryptedTokenAddress, euint32 encryptedPercentage) internal {
        encryptedBeneficiaries.push(EncryptedBeneficiary({
            encryptedAddress: encryptedAddress,
            encryptedTokenAddress: encryptedTokenAddress,
            encryptedPercentage: encryptedPercentage
        }));
    }

    function distributeInheritance() public {
        require(encryptedBeneficiaries.length > 0, "No beneficiaries stored");

        for (uint256 i = 0; i < encryptedBeneficiaries.length; i++) {
            eaddress encryptedBeneficiaryAddress = encryptedBeneficiaries[i].encryptedAddress;
            eaddress encryptedTokenAddress = encryptedBeneficiaries[i].encryptedTokenAddress;
            euint32 encryptedPercentage = encryptedBeneficiaries[i].encryptedPercentage;

            // Decrypt beneficiary address and token address
            address beneficiaryAddress = FHE.decrypt(encryptedBeneficiaryAddress);
            address tokenAddress = FHE.decrypt(encryptedTokenAddress);

            // Calculate the amount to transfer based on encrypted percentage
            uint256 tokenBalance = IERC20(tokenAddress).balanceOf(owner);
            euint32 encryptedTokenBalance = FHE.asEuint32(tokenBalance);
            euint32 encryptedAmount = (encryptedTokenBalance * encryptedPercentage) / FHE.asEuint32(100);
            uint32 decryptedValue = FHE.decrypt(encryptedAmount);

            // Transfer the amount from the owner to the beneficiary
            IERC20(tokenAddress).transferFrom(owner, beneficiaryAddress, decryptedValue);
        }
    }

}
