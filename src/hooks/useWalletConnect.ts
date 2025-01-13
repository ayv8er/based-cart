"use client";
import { useConnect } from 'wagmi';
import { useState, useEffect } from 'react';

export default function useWalletConnect() {
  const [buttonState, setButtonState] = useState<"idle" | "pending" | "error">("idle");
  
  const { connect, connectors, error } = useConnect({
    mutation: {
      onSuccess: () => {
        setButtonState("idle");
      },
      onError: () => {
        setButtonState("error");
        setTimeout(() => {
          setButtonState("idle");
        }, 500);
      }
    }
  });

  useEffect(() => {
    if (!error && buttonState === "error") {
      setButtonState("idle");
    }
  }, [error, buttonState]);

  const handleConnect = () => {
    setButtonState("pending");
    connect({ connector: connectors[0] });
  };

  return {
    handleConnect,
    buttonState,
    isLoading: buttonState === "pending"
  };
}