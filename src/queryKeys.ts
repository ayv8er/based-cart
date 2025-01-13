export const QUERY_KEYS = {
  readContract: (params: { address: string; functionName: string; chainId: number; account?: string }) => [
    'readContract',
    params,
  ],
};