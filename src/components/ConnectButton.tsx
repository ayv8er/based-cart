// import { WalletDefault } from "@coinbase/onchainkit/wallet";
import useWalletConnect from "@/hooks/useWalletConnect";

export default function LoginButton() {
  const { handleConnect, buttonState } = useWalletConnect();
  
  return (
    // <WalletDefault />
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={handleConnect}
      disabled={buttonState === "pending"}
    >
      { buttonState === "pending" ? "Loading..." : buttonState === "error" ? "Error" : "Connect" }
    </button>
  )
}