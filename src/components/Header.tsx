"use client";
import useWallet from "@/hooks/useWallet";
import { Address } from '@coinbase/onchainkit/identity';
import { useSwitchChain } from 'wagmi';

export default function Header() {
  const { address, isError, isLoading, chain } = useWallet();
  const { switchChain } = useSwitchChain();

  if (isLoading) return <header>Loading wallet data...</header>;
  if (isError) return <header>Error fetching wallet data</header>;

  return (
    <div className="flex justify-between items-center border-b px-4 py-4">
      <Address 
        address={address} 
        className="hover:text-blue-600 cursor-pointer"
      /> 
    {chain?.id === 8453 ? (
        <div className="text-sm">On Base</div>
      ) : (
        <div
          className="text-sm hover:text-blue-600 cursor-pointer"
          onClick={() => {
            if (switchChain) {
              switchChain({ chainId: 8453 });
            }
          }}
        >
          Switch to Base
        </div>
      )}
  </div>
  );
};
