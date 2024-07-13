pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract InheritanceManager is EIP712WithModifier {
    address public owner;

    struct EncryptedBeneficiary {
        eaddress encryptedAddress;
        eaddress encryptedTokenAddress;
        euint32 encryptedPercentage;
    }

    struct Beneficiary {
        uint256 beneficiaryAddress;
        uint256 tokenAddress;
        uint256 percentage;
    }

    EncryptedBeneficiary[] public encryptedBeneficiaries;
    Beneficiary[] public beneficiaries;

    constructor() EIP712WithModifier("Authorization token", "1") {
        owner = msg.sender;
    }

    function storeBeneficiary(eaddress calldata encryptedAddress, eaddress calldata encryptedTokenAddress, uint256 calldata encryptedPercentage) public {
        require(msg.sender == owner, "Only owner can store beneficiaries");

        encryptedBeneficiaries.push(EncryptedBeneficiary({
            encryptedAddress: encryptedAddress,
            encryptedTokenAddress: encryptedTokenAddress,
            encryptedPercentage: encryptedPercentage
        }));
    }

    function decryptBeneficiaries() public onlyOwner {
        for (uint256 i = 0; i < encryptedBeneficiaries.length; i++) {
            beneficiaries.push(Beneficiary({
                beneficiaryAddress: FHE.decrypt(encryptedBeneficiaries[i].encryptedAddress),
                tokenAddress: FHE.decrypt(encryptedBeneficiaries[i].encryptedTokenAddress),
                percentage: FHE.decrypt(encryptedBeneficiaries[i].encryptedPercentage)
            }));
        }
    }

    function distributeInheritance() public {
        require(beneficiaries.length > 0, "No decrypted beneficiaries found");

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            Beneficiary memory beneficiary = beneficiaries[i];
            address beneficiaryAddress = address(uint160(beneficiary.beneficiaryAddress));
            IERC20 token = IERC20(address(uint160(beneficiary.tokenAddress)));
            uint256 tokenBalance = token.balanceOf(owner);
            uint256 amount = (tokenBalance * beneficiary.percentage) / 100;
            token.transferFrom(owner, beneficiaryAddress, amount);
        }
    }
}
