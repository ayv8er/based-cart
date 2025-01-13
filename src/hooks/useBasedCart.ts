import { useState } from "react";
import { useWriteContract, usePublicClient } from "wagmi";
import { useQueryClient } from '@tanstack/react-query';
import { basedCartAbi } from "@/ethereum/abi/BasedCart";
import { getAddress, parseUnits } from "viem";
import { iERC20Abi } from "@/ethereum/abi/IERC20";
import { QUERY_KEYS } from "@/queryKeys";
import { BASED_CART_FACTORY_ADDRESS, BASE_USDC_ADDRESS } from "@/ethereum/constants";

export default function useBasedCart({ contractAddress }: { contractAddress: string }) {
  const [fundAmount, setFundAmount] = useState<number | null>(null);
  const publicClient = usePublicClient();
  const queryClient = useQueryClient();

  const { writeContractAsync: withdrawAndDestroy } = useWriteContract({
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

  const { writeContractAsync: depositMoreFunds } = useWriteContract({
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
        console.error('Error depositing more funds:', error);
      },
    }
  });

  const { writeContractAsync: approveUsdcOnFund} = useWriteContract({
    mutation: {
      onSuccess: async (hash) => {
        await publicClient?.waitForTransactionReceipt({ hash });
        if (fundAmount) {
          const amountInUnits = parseUnits(fundAmount.toString(), 6);
          await depositMoreFunds({
            address: getAddress(contractAddress) as `0x${string}`,
            abi: basedCartAbi,
            functionName: 'depositMoreFunds',
            chainId: 8453,
            args: [amountInUnits],
          })
        }
      },
      onError: (error) => {
        console.error('Error approving USDC:', error);
      },
    }
  });

  const { writeContractAsync: deleteItems } = useWriteContract({
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
        console.error('Error deleting items:', error);
      },
    }
  });

  const { writeContractAsync: claimDelivery } = useWriteContract({
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
        console.error('Error claiming delivery:', error);
      },
    }
  });

  const { writeContractAsync: forfeitDelivery } = useWriteContract({
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
        console.error('Error forfeiting delivery:', error);
      },
    }
  });

  const { writeContractAsync: closeSuccessDelivery } = useWriteContract({
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
        console.error('Error closing delivery:', error);
      },
    }
  });

  const closeSuccessDeliveryAsync = async () => {
    try {
      return closeSuccessDelivery({
        address: getAddress(contractAddress) as `0x${string}`,
        abi: basedCartAbi,
        functionName: 'closeSuccessDelivery',
        chainId: 8453,
      })
    } catch (error) {
      console.error('Error closing delivery:', error);
    }
  };

  const forfeitDeliveryAsync = async () => {
    try {
      return forfeitDelivery({
        address: getAddress(contractAddress) as `0x${string}`,
        abi: basedCartAbi,
        functionName: 'forfeitDelivery',
        chainId: 8453,
      })
    } catch (error) {
      console.error('Error revoking claim:', error);
    }
  };

  const claimDeliveryAsync = async () => {
    try {
      return claimDelivery({
        address: getAddress(contractAddress) as `0x${string}`,
        abi: basedCartAbi,
        functionName: 'claimDelivery',
        chainId: 8453,
      })
    } catch (error) {
      console.error('Error claiming delivery:', error);
    }
  };

  const approveUsdcAndFundCartAsync = async (amount: number) => {
    try {
      const amountInUnits = parseUnits(amount.toString(), 6);
      setFundAmount(amount);
      return approveUsdcOnFund({
        address: BASE_USDC_ADDRESS,
        abi: iERC20Abi,
        functionName: "approve",
        chainId: 8453,
        args: [getAddress(contractAddress) as `0x${string}`, amountInUnits],
      })
    } catch (error) {
      console.error('Error approving USDC for cart:', error);
    }
  };

  const withdrawAndDestroyAsync = async () => {
    try {
      return withdrawAndDestroy({
        address: getAddress(contractAddress) as `0x${string}`,
        abi: basedCartAbi,
        functionName: 'withdrawAndDestroy',
        chainId: 8453,
      })
    } catch (error) {
      console.error('Error withdrawing and destroying cart:', error);
    }
  };

  const deleteItemsAsync = async (items: string[]) => {
    try {
      return deleteItems({
        address: getAddress(contractAddress) as `0x${string}`,
        abi: basedCartAbi,
        functionName: 'deleteItems',
        chainId: 8453,
        args: [items],
      })
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  return { 
    withdrawAndDestroyAsync, 
    approveUsdcAndFundCartAsync,
    deleteItemsAsync,
    claimDeliveryAsync,
    forfeitDeliveryAsync,
    closeSuccessDeliveryAsync
  };
};