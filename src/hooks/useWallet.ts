import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from "viem";

export default function useWallet() {
  const { address, isConnected, isDisconnected, chain } = useAccount();
  const { data: balanceData, isError, isLoading } = useBalance({
    address
  });

  const balance = balanceData
    ? formatUnits(balanceData.value, balanceData.decimals)
    : null;

  return {
    address,
    isConnected,
    isDisconnected,
    isError,
    isLoading,
    balance,
    symbol: balanceData?.symbol,
    chain
  };
}