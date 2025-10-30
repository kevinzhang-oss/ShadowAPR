import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { Contract } from 'ethers';
import { formatUnits, parseUnits } from 'viem';

import { useEthersSigner } from '../hooks/useEthersSigner';
import { CUSDT_CONTRACT, STAKING_CONTRACT, TOKEN_DECIMALS } from '../config/contracts';
import '../styles/StakingApp.css';

type AccountSnapshot = {
  staked: bigint;
  accrued: bigint;
  pending: bigint;
  lastUpdate: number;
  totalStaked: bigint;
};

const DEFAULT_ACCOUNT_SNAPSHOT: AccountSnapshot = {
  staked: 0n,
  accrued: 0n,
  pending: 0n,
  lastUpdate: 0,
  totalStaked: 0n,
};

const OPERATOR_WINDOW = 60 * 60 * 24 * 30; // 30 days

function formatAmount(value: bigint, minimumFractionDigits = 0) {
  const formatted = formatUnits(value, TOKEN_DECIMALS);
  const numeric = Number.parseFloat(formatted);
  if (Number.isNaN(numeric)) {
    return formatted;
  }
  return numeric.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: 4,
  });
}

export function StakingApp() {
  const { address, isConnected } = useAccount();
  const signerPromise = useEthersSigner();
  const publicClient = usePublicClient();

  const [snapshot, setSnapshot] = useState<AccountSnapshot>(DEFAULT_ACCOUNT_SNAPSHOT);
  const [operatorGranted, setOperatorGranted] = useState(false);
  const [stakeInput, setStakeInput] = useState('1000');
  const [unstakeInput, setUnstakeInput] = useState('');
  const [faucetInput, setFaucetInput] = useState('1000');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const refresh = useCallback(async () => {
    if (!publicClient || !address) {
      setSnapshot(DEFAULT_ACCOUNT_SNAPSHOT);
      setOperatorGranted(false);
      return;
    }

    try {
      setIsRefreshing(true);
      const stakingAddress = STAKING_CONTRACT.address as `0x${string}`;
      const accountAddress = address as `0x${string}`;
      const [infoRaw, pendingRaw, totalRaw, operatorRaw] = await Promise.all([
        publicClient.readContract({
          address: stakingAddress,
          abi: STAKING_CONTRACT.abi,
          functionName: 'accountInfo',
          args: [accountAddress],
        }) as Promise<[bigint, bigint, number]>,
        publicClient.readContract({
          address: stakingAddress,
          abi: STAKING_CONTRACT.abi,
          functionName: 'pendingReward',
          args: [accountAddress],
        }) as Promise<bigint>,
        publicClient.readContract({
          address: stakingAddress,
          abi: STAKING_CONTRACT.abi,
          functionName: 'totalStaked',
        }) as Promise<bigint>,
        publicClient.readContract({
          address: CUSDT_CONTRACT.address as `0x${string}`,
          abi: CUSDT_CONTRACT.abi,
          functionName: 'isOperator',
          args: [accountAddress, stakingAddress],
        }) as Promise<boolean>,
      ]);

      setSnapshot({
        staked: infoRaw[0],
        accrued: infoRaw[1],
        lastUpdate: Number(infoRaw[2]),
        pending: pendingRaw,
        totalStaked: totalRaw,
      });
      setOperatorGranted(Boolean(operatorRaw));
    } catch (error) {
      console.error('Failed to refresh staking data:', error);
      setErrorMessage('Unable to fetch latest staking data');
    } finally {
      setIsRefreshing(false);
    }
  }, [address, publicClient]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const dailyEstimate = useMemo(() => {
    if (snapshot.staked === 0n) {
      return '0';
    }
    return formatAmount(snapshot.staked / 1000n);
  }, [snapshot.staked]);

  const execute = useCallback(
    async (action: () => Promise<void>, successMessage: string) => {
      if (!isConnected) {
        setErrorMessage('Connect your wallet to proceed');
        return;
      }

      try {
        setErrorMessage(null);
        setStatusMessage(null);
        setIsProcessing(true);
        await action();
        setStatusMessage(successMessage);
        await refresh();
      } catch (error) {
        console.error('Transaction failed:', error);
        const reason = error instanceof Error ? error.message : 'Transaction failed';
        setErrorMessage(reason);
      } finally {
        setIsProcessing(false);
      }
    },
    [isConnected, refresh]
  );

  const authorizeStaking = useCallback(() => {
    return execute(async () => {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const stakingAddress = STAKING_CONTRACT.address;
      const contract = new Contract(CUSDT_CONTRACT.address, CUSDT_CONTRACT.abi, signer);
      const latestBlock = await signer.provider!.getBlock('latest');
      const expiry = latestBlock ? latestBlock.timestamp + OPERATOR_WINDOW : Math.floor(Date.now() / 1000) + OPERATOR_WINDOW;
      const tx = await contract.setOperator(stakingAddress, expiry);
      await tx.wait();
      setOperatorGranted(true);
    }, 'Staking contract authorized for transfers');
  }, [execute, signerPromise]);

  const stakeTokens = useCallback(() => {
    return execute(async () => {
      if (!stakeInput.trim()) {
        throw new Error('Enter an amount to stake');
      }

      const amount = parseUnits(stakeInput, TOKEN_DECIMALS);
      if (amount <= 0n) {
        throw new Error('Stake amount must be greater than zero');
      }

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const contract = new Contract(STAKING_CONTRACT.address, STAKING_CONTRACT.abi, signer);
      const tx = await contract.stake(amount);
      await tx.wait();
      setStakeInput('');
    }, 'Stake completed successfully');
  }, [execute, stakeInput, signerPromise]);

  const unstakeTokens = useCallback(() => {
    return execute(async () => {
      if (!unstakeInput.trim()) {
        throw new Error('Enter an amount to unstake');
      }
      const amount = parseUnits(unstakeInput, TOKEN_DECIMALS);
      if (amount <= 0n) {
        throw new Error('Unstake amount must be greater than zero');
      }

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const contract = new Contract(STAKING_CONTRACT.address, STAKING_CONTRACT.abi, signer);
      const tx = await contract.unstake(amount);
      await tx.wait();
      setUnstakeInput('');
    }, 'Unstake completed successfully');
  }, [execute, unstakeInput, signerPromise]);

  const claimRewards = useCallback(() => {
    return execute(async () => {
      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }
      const contract = new Contract(STAKING_CONTRACT.address, STAKING_CONTRACT.abi, signer);
      const tx = await contract.claimReward();
      await tx.wait();
    }, 'Rewards claimed successfully');
  }, [execute, signerPromise]);

  const mintTokens = useCallback(() => {
    return execute(async () => {
      if (!faucetInput.trim()) {
        throw new Error('Enter an amount to mint');
      }
      const amount = parseUnits(faucetInput, TOKEN_DECIMALS);
      if (amount <= 0n) {
        throw new Error('Mint amount must be greater than zero');
      }

      const signer = await signerPromise;
      if (!signer) {
        throw new Error('Signer not available');
      }

      const contract = new Contract(CUSDT_CONTRACT.address, CUSDT_CONTRACT.abi, signer);
      const target = await signer.getAddress();
      const tx = await contract.mint(target, amount);
      await tx.wait();
    }, 'cUSDT minted to your wallet');
  }, [execute, faucetInput, signerPromise]);

  const hasStaked = snapshot.staked > 0n;

  if (!isConnected) {
    return (
      <div className="staking-app">
        <section className="info-card">
          <h2>Welcome to ShadowAPR</h2>
          <p>Connect your wallet to start staking cUSDT and earning cZAMA rewards.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="staking-app">
      <section className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Your Staked cUSDT</span>
          <span className="summary-value">{formatAmount(snapshot.staked)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Unclaimed cZAMA</span>
          <span className="summary-value highlight">{formatAmount(snapshot.pending)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Estimated Daily cZAMA</span>
          <span className="summary-value">{dailyEstimate}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Protocol Stake</span>
          <span className="summary-value">{formatAmount(snapshot.totalStaked)}</span>
        </div>
      </section>

      {statusMessage ? <div className="banner success">{statusMessage}</div> : null}
      {errorMessage ? <div className="banner error">{errorMessage}</div> : null}
      {isRefreshing ? <div className="banner info">Refreshing staking data…</div> : null}

      <section className="actions-grid">
        <div className="action-card">
          <header>
            <h3>Authorize Contract</h3>
            <p>Allow the staking contract to transfer your cUSDT when you stake.</p>
          </header>
          <div className="action-content">
            <p className={operatorGranted ? 'status ready' : 'status pending'}>
              {operatorGranted ? 'Authorization active' : 'Authorization required'}
            </p>
            <button
              className="primary-button"
              onClick={authorizeStaking}
              disabled={isProcessing || operatorGranted}
            >
              {operatorGranted ? 'Already Authorized' : 'Authorize Staking'}
            </button>
          </div>
        </div>

        <div className="action-card">
          <header>
            <h3>Stake cUSDT</h3>
            <p>Stake cUSDT to start accruing cZAMA rewards.</p>
          </header>
          <div className="action-content">
            <input
              type="number"
              min="0"
              step="0.000001"
              value={stakeInput}
              onChange={(event) => setStakeInput(event.target.value)}
              placeholder="Amount in cUSDT"
            />
            <button
              className="primary-button"
              onClick={stakeTokens}
              disabled={isProcessing || !operatorGranted}
            >
              Stake
            </button>
            {!operatorGranted ? (
              <p className="helper-text">Authorize the staking contract before staking.</p>
            ) : null}
          </div>
        </div>

        <div className="action-card">
          <header>
            <h3>Unstake</h3>
            <p>Withdraw part or all of your staked cUSDT.</p>
          </header>
          <div className="action-content">
            <input
              type="number"
              min="0"
              step="0.000001"
              value={unstakeInput}
              onChange={(event) => setUnstakeInput(event.target.value)}
              placeholder="Amount in cUSDT"
            />
            <button
              className="secondary-button"
              onClick={unstakeTokens}
              disabled={isProcessing || !hasStaked}
            >
              Unstake
            </button>
          </div>
        </div>

        <div className="action-card">
          <header>
            <h3>Claim Rewards</h3>
            <p>Transfer your accrued cZAMA rewards to your wallet.</p>
          </header>
          <div className="action-content">
            <button
              className="secondary-button"
              onClick={claimRewards}
              disabled={isProcessing || snapshot.pending === 0n}
            >
              Claim cZAMA
            </button>
            {snapshot.pending === 0n ? (
              <p className="helper-text">Rewards accumulate daily based on your stake.</p>
            ) : null}
          </div>
        </div>

        <div className="action-card">
          <header>
            <h3>cUSDT Faucet</h3>
            <p>Mint test cUSDT to experiment with the protocol.</p>
          </header>
          <div className="action-content">
            <input
              type="number"
              min="0"
              step="0.000001"
              value={faucetInput}
              onChange={(event) => setFaucetInput(event.target.value)}
              placeholder="Amount in cUSDT"
            />
            <button
              className="secondary-button"
              onClick={mintTokens}
              disabled={isProcessing}
            >
              Mint cUSDT
            </button>
            <p className="helper-text">Minted tokens are confidential and stay in your wallet.</p>
          </div>
        </div>
      </section>

      <section className="info-card">
        <h3>How rewards work</h3>
        <ul>
          <li>For every 1,000 cUSDT you stake you earn 1 cZAMA per day.</li>
          <li>Rewards accrue every second and remain claimable at any time.</li>
          <li>Unstaking stops new rewards from accruing for the withdrawn amount.</li>
          <li>The staking contract holds a pre-funded cZAMA reserve for payouts.</li>
        </ul>
      </section>
    </div>
  );
}
