// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// OpenZeppelin libraries for security and standards
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SocietyToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion tokens
    uint256 public burnRate = 2; // 2% burn on each transaction
    uint256 public stakingRewardRate = 10; // 10% annual reward for staking

    // Staking variables
    struct Stake {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Stake) public stakes;
    mapping(address => uint256) public rewards;

    event TokensBurned(address indexed from, uint256 amount);
    event TokensStaked(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 amount);

    constructor() ERC20("SocietyToken", "STK") {
        _mint(msg.sender, (MAX_SUPPLY * 50) / 100); // Mint 50% to the owner
    }

    // Function to update burn rate
    function setBurnRate(uint256 _burnRate) external onlyOwner {
        require(_burnRate <= 10, "Burn rate cannot exceed 10%");
        burnRate = _burnRate;
    }

    // Overriding transfer to include burn mechanism
    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        uint256 burnAmount = (amount * burnRate) / 100;
        uint256 transferAmount = amount - burnAmount;

        _burn(_msgSender(), burnAmount);
        emit TokensBurned(_msgSender(), burnAmount);

        return super.transfer(recipient, transferAmount);
    }

    // Stake tokens
    function stakeTokens(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= amount, "Not enough tokens to stake");

        // Transfer tokens to contract and update stake info
        _transfer(msg.sender, address(this), amount);
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].timestamp = block.timestamp;

        emit TokensStaked(msg.sender, amount);
    }

    // Calculate rewards
    function calculateRewards(address staker) public view returns (uint256) {
        Stake memory stakeInfo = stakes[staker];
        if (stakeInfo.amount == 0) return 0;

        uint256 stakingDuration = block.timestamp - stakeInfo.timestamp; // in seconds
        uint256 reward = (stakeInfo.amount *
            stakingRewardRate *
            stakingDuration) / (365 days * 100);
        return reward;
    }

    // Claim rewards
    function claimRewards() external nonReentrant {
        uint256 reward = calculateRewards(msg.sender);
        require(reward > 0, "No rewards to claim");

        rewards[msg.sender] += reward;
        stakes[msg.sender].timestamp = block.timestamp;

        _mint(msg.sender, reward);
        emit RewardsClaimed(msg.sender, reward);
    }

    // Withdraw staked tokens
    function withdrawStake(uint256 amount) external nonReentrant {
        require(
            stakes[msg.sender].amount >= amount,
            "Not enough staked tokens"
        );

        uint256 reward = calculateRewards(msg.sender);
        rewards[msg.sender] += reward;

        stakes[msg.sender].amount -= amount;
        stakes[msg.sender].timestamp = block.timestamp;

        _transfer(address(this), msg.sender, amount);
    }

    // Governance voting functionality can be added here
}
