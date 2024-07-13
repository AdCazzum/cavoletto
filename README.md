# Cavoletto

<img src="cavoletto.png" width="70%"/>

## Flows

The DApp allows users to deploy smart contracts on the Fhenix testnet and specify a list of heirs and which percentages of which token they will inherit.
Tokens can be both TEth, generic ERC-20 tokens and NFTs.
All the information (hiers, tokens and percentages) will be stored on chain encrytped, so they will be secret as long as the testator is alive.
When the testator/deployer will declared dead whoever will be able to trigger the contract and distribute the inheritance.
As possible strategies for the proof of death we considered TLSNotary or simply a mechanism that automatically marks the testator as dead after a certain amount of time if he/she doesn't recurrently call a contract's method.

### Testator

0. The wallet is connected
1. Opens the website and click on "make will"
2. Sets which tokens (for now let's assume WETH) and NFTs and the percentages that everybody is going to inherit
3. Approve/transfer to the contract
4. Click on something -> the information above is stored encrypted in a contract
5. The testator keeps sending a transaction to prove he's still alive until...
5. BIS: use TLSNotary

### Heir

0. The wallet is connected
1. ...he doesn't send those transactions anymore and a counter in the contract reaches a certain value
2. Potentially whoever can call the contract triggering it
3. The amounts are computed and transferred
4. Profit

## Frontned

```bash
pnpm install
pnpm localfhenix:start
npx hardhat deploy
npx hardhat test
npx hardhat test --network localfhenix
```
