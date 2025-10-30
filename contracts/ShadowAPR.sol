// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64} from "@fhevm/solidity/lib/FHE.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

import {ERC7984USDT} from "./ERC7984USDT.sol";
import {ERC7984Zama} from "./ERC7984Zama.sol";

contract ShadowAPR is SepoliaConfig {
    using SafeCast for uint256;

    struct StakePosition {
        uint256 stakedAmount;
        uint256 accruedReward;
        uint40 lastUpdateTimestamp;
    }

    uint256 private constant SECONDS_PER_DAY = 1 days;
    uint256 private constant REWARD_DIVISOR = 1000 * SECONDS_PER_DAY;

    ERC7984USDT public immutable stakingToken;
    ERC7984Zama public immutable rewardToken;

    mapping(address => StakePosition) private _stakes;

    uint256 public totalStaked;

    event Staked(address indexed user, uint64 amount);
    event Unstaked(address indexed user, uint64 amount);
    event RewardClaimed(address indexed user, uint64 amount);

    constructor(ERC7984USDT stakingToken_, ERC7984Zama rewardToken_) {
        stakingToken = stakingToken_;
        rewardToken = rewardToken_;
    }

    function stake(uint64 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        StakePosition storage position = _stakes[msg.sender];
        _accrueRewards(position);

        euint64 encryptedAmount = FHE.asEuint64(amount);
        FHE.allow(encryptedAmount, address(this));
        FHE.allow(encryptedAmount, address(stakingToken));
        stakingToken.confidentialTransferFrom(msg.sender, address(this), encryptedAmount);

        position.stakedAmount += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint64 amount) external {
        require(amount > 0, "Amount must be greater than zero");

        StakePosition storage position = _stakes[msg.sender];
        require(position.stakedAmount >= amount, "Insufficient staked amount");

        _accrueRewards(position);

        position.stakedAmount -= amount;
        totalStaked -= amount;

        euint64 encryptedAmount = FHE.asEuint64(amount);
        FHE.allow(encryptedAmount, address(this));
        FHE.allow(encryptedAmount, address(stakingToken));
        stakingToken.confidentialTransfer(msg.sender, encryptedAmount);

        emit Unstaked(msg.sender, amount);
    }

    function claimReward() external {
        StakePosition storage position = _stakes[msg.sender];
        _accrueRewards(position);

        uint256 reward = position.accruedReward;
        require(reward > 0, "No rewards to claim");

        position.accruedReward = 0;

        uint64 rewardAmount = reward.toUint64();
        euint64 encryptedReward = FHE.asEuint64(rewardAmount);
        FHE.allow(encryptedReward, address(this));
        FHE.allow(encryptedReward, address(rewardToken));
        rewardToken.confidentialTransfer(msg.sender, encryptedReward);

        emit RewardClaimed(msg.sender, rewardAmount);
    }

    function accountInfo(address user)
        external
        view
        returns (uint256 stakedAmount, uint256 accruedReward, uint40 lastUpdate)
    {
        StakePosition storage position = _stakes[user];
        stakedAmount = position.stakedAmount;
        accruedReward = position.accruedReward + _pendingSince(position);
        lastUpdate = position.lastUpdateTimestamp;
    }

    function pendingReward(address user) external view returns (uint256) {
        StakePosition storage position = _stakes[user];
        return position.accruedReward + _pendingSince(position);
    }

    function stakedBalance(address user) external view returns (uint256) {
        return _stakes[user].stakedAmount;
    }

    function _accrueRewards(StakePosition storage position) private {
        uint256 newlyAccrued = _pendingSince(position);
        if (newlyAccrued > 0) {
            position.accruedReward += newlyAccrued;
        }
        position.lastUpdateTimestamp = uint40(block.timestamp);
    }

    function _pendingSince(StakePosition storage position) private view returns (uint256) {
        if (position.stakedAmount == 0) {
            return 0;
        }

        uint40 lastUpdate = position.lastUpdateTimestamp;
        if (lastUpdate == 0) {
            return 0;
        }

        uint256 elapsed = block.timestamp - uint256(lastUpdate);
        if (elapsed == 0) {
            return 0;
        }

        return (position.stakedAmount * elapsed) / REWARD_DIVISOR;
    }
}
