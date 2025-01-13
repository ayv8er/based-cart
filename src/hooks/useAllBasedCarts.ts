import { useMemo } from "react";
import useBasedCartFactory from "./useBasedCartFactory";
import useWallet from "./useWallet";
import { useReadContracts } from "wagmi";
import { basedCartAbi } from "../ethereum/abi/BasedCart";
import { formatUnits, type Abi } from "viem";

type CartResult = [string, string[], boolean, bigint, string, string];

export default function useAllBasedCarts() {
  const { cartAddresses } = useBasedCartFactory();
  const { address } = useWallet();

  const { data, refetch } = useReadContracts({
    contracts: cartAddresses.map((cartAddress) => ({
      address: cartAddress as `0x${string}`,
      abi: basedCartAbi as Abi,
      functionName: 'getCartInfo',
      chainId: 8453,
      query: {
        enabled: true,
        staleTime: 0,
        gcTime: 0
      }
    })),
  })

  const allCarts = useMemo(() => {
    if (!data || !cartAddresses) return [];

    const mappedCarts = data.map((cart, index) => {
      const address = cartAddresses[index];
      const [name, items, isCompleted, funds, fulfiller, owner] = cart.result as CartResult;

      const cartFunds = formatUnits(funds, 6);

      const cartFulfiller = fulfiller && fulfiller !== "0x0000000000000000000000000000000000000000"
        ? fulfiller
        : null;

      return {
        address,
        name, 
        items, 
        isCompleted, 
        funds: cartFunds, 
        fulfiller: cartFulfiller,
        owner
      };
    });

    return mappedCarts;
  }, [data, cartAddresses]);

  const myCarts = useMemo(() => allCarts.filter((cart) => cart.owner?.toLowerCase() === address?.toLowerCase()), [allCarts, address]);
  const otherCarts = useMemo(() => allCarts.filter((cart) => cart.owner?.toLowerCase() !== address?.toLowerCase()), [allCarts, address]);

  return { myCarts, otherCarts, refetch };
};