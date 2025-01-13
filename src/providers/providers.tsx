"use client";
import { type ReactNode, useState, useEffect } from "react";
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { getConfig } from "./config";
import { base } from "wagmi/chains";

type Props = {
  children: ReactNode;
};

export function Providers({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: true,
        gcTime: 0,
      },
    },
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={base}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};