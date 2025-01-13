"use client";
import useWallet from "@/hooks/useWallet";
import ConnectButton from "@/components/ConnectButton";
import Dashboard from "./dashboard/page";

export default function Home() {
  const { address } = useWallet();

  return address ? <Dashboard /> : (
    <div className="h-screen flex items-center justify-center">
      <ConnectButton />
    </div>
  )
}
