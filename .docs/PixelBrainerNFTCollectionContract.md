## 🧠 `PixelBrainerNFTCollection` – Smart Contract

ERC-721 NFT collection with limited minting, unique IPFS-hosted metadata, and dynamic phase-based pricing.  
Secure and production-ready contract.

---

### 📌 General Description

- 🔗 **Name**: PixelBrainerCollection
- 🧠 **Symbol**: PBC1
- 🧪 **Standard**: ERC721 (OpenZeppelin)
- 🧱 **Distribution**: `maxSupply` unique NFTs
- 🌐 **Metadata**: Randomly assigned URIs from IPFS
- 💰 **Mint**: Dynamic pricing based on minting phase (quartiles)
- ⛔ **Limit**: 2 NFTs per wallet
- 🔒 **Anti-bot**: No minting from smart contracts
- 🔐 **Owner**: Can withdraw contract funds
- 🛑 **Auto-pause**: Minting deactivates automatically when supply is reached

---

### ⚙️ Constructor

```solidity
constructor(
  uint256 _maxSupply,
  uint256 _mintPrice,
  uint256 _transferFeePercentage,
  string[] memory uris
)
```

- `maxSupply`: Total number of NFTs
- `mintPrice`: Base price (in wei)
- `transferFeePercentage`: Reserved field (currently unused)
- `uris`: Array of unique IPFS metadata (must match `maxSupply`)

---

### 💻 Public Functions

| Function                 | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| `mintNFT(address)`       | Mints an NFT for the specified address (max 2 per wallet) |
| `getMintPrice()`         | Returns the current price based on phase                  |
| `isMintingActive()`      | Returns `true` if minting is still open                   |
| `tokenURI(tokenId)`      | Returns the metadata URI for a token                      |
| `isURIAvailable(uri)`    | Checks if a URI has already been used                     |
| `withdrawFunds(address)` | Owner can withdraw contract balance                       |

---

### 🧠 Pricing by Phase

Base price adjusts based on quartiles of the `maxSupply`:

| Phase | Supply Minted | Price               |
| ----- | ------------- | ------------------- |
| 1     | 0%–25%        | 100% of `mintPrice` |
| 2     | 25%–50%       | +15%                |
| 3     | 50%–75%       | +30%                |
| 4     | 75%–100%      | +45%                |

---

### 🚫 Restrictions

- Only externally owned accounts (EOAs) can mint (no contracts)
- Maximum of 2 NFTs per wallet
- Minting **automatically disables** when `maxSupply` is reached

---

### 🚀 Deployment (Hardhat)

```bash
npx hardhat run scripts/deploy.js --network base
```

Example constructor usage:

```js
const factory = await ethers.getContractFactory("PixelBrainerNFTCollection");
const contract = await factory.deploy(
  8000,
  ethers.parseEther("0.01"), // 0.01 ETH
  0, // transfer fee currently unused
  metadataURIsArray
);
```

---

### 🧬 TODO / Future Features (optional)

- Support for token burning (`burn`)
- Integration with games or leveling systems
- `transferWithFee()` function if fee system is added later

---

### 🔐 Audited by: MasterBrainer & ChatGPT v4 😎

_Engineered for brainer believers. Mint it or miss it._
