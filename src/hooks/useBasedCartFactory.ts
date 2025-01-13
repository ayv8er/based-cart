"use client";
import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, usePublicClient } from "wagmi";
import { useQueryClient } from '@tanstack/react-query';
import { basedCartFactoryAbi } from "../ethereum/abi/BasedCartFactory";
import { iERC20Abi } from "@/ethereum/abi/IERC20";
import { parseUnits } from "viem";
import { QUERY_KEYS } from "@/queryKeys";
import { BASED_CART_FACTORY_ADDRESS, BASE_USDC_ADDRESS } from "@/ethereum/constants";

type NewCartArgs = {
  cartName: string;
  amount: number;
  items: string[];
};

export default function useBasedCartFactory() {
  const [cartAddresses, setCartAddresses] = useState<string[]>([]);
  const [newCartArgs, setNewCartArgs] = useState<NewCartArgs | null>(null);
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  const { data: allCartAddresses, isLoading, isError } = useReadContract({
    address: BASED_CART_FACTORY_ADDRESS,
    abi: basedCartFactoryAbi,
    functionName: 'getAllCartAddresses',
    chainId: 8453,
    query: {
      enabled: true,
      staleTime: 0,
      gcTime: 0
    },
  });

  const { writeContractAsync: createCart } = useWriteContract({
    mutation: {
      onSuccess: async (hash) => {
        await publicClient?.waitForTransactionReceipt({ hash });
        const allCartAddressesQueryKey = QUERY_KEYS.readContract({
          address: BASED_CART_FACTORY_ADDRESS,
          functionName: 'getAllCartAddresses',
          chainId: 8453,
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: allCartAddressesQueryKey,
          }),
        ]);
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: allCartAddressesQueryKey,
          }),
        ]);
      },
      onError: (error) => {
        console.error('Error creating cart:', error);
      },
    }
  });

  const { writeContractAsync: approveUsdcOnCreate } = useWriteContract({
    mutation: {
      onSuccess: async (hash) => {
        await publicClient?.waitForTransactionReceipt({ hash });
        if (newCartArgs) {
          const amountInUnits = parseUnits(newCartArgs.amount.toString(), 6);
          await createCart({
            address: BASED_CART_FACTORY_ADDRESS,
            abi: basedCartFactoryAbi,
            functionName: 'createCart',
            chainId: 8453,
            args: [newCartArgs.cartName, amountInUnits, newCartArgs.items],
          });
        }
      },
      onError: (error) => {
        console.error('Error approving USDC:', error);
      },
    }
  });

  useEffect(() => {
    if (allCartAddresses) {
      setCartAddresses(allCartAddresses as unknown as string[]);
    }
  }, [allCartAddresses]);


  const approveUsdcAndCreateCartAsync = async (cartName: string, amount: number, items: string[]) => {
    try {
      const amountInUnits = parseUnits(amount.toString(), 6);
      setNewCartArgs({
        cartName,
        amount,
        items
      });
      return await approveUsdcOnCreate({
        address: BASE_USDC_ADDRESS,
        abi: iERC20Abi,
        functionName: 'approve',
        chainId: 8453,
        args: [BASED_CART_FACTORY_ADDRESS, amountInUnits],
      });
    } catch (error) {
      console.error('Error approving USDC:', error);
    }
  };
  
  return { 
    cartAddresses, 
    isLoading, 
    isError,
    approveUsdcAndCreateCartAsync
  };
};