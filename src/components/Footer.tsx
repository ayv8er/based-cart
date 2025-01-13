import { useDisconnect } from "wagmi";

export default function Footer() {
  const { disconnect } = useDisconnect();

  function handleDisconnect() {
    disconnect();
  };

  return (
    <footer className="text-sm w-full px-4 py-4 mt-4 border-t flex justify-around items-center">
      <a
        href="https://www.alchemy.com/faucets/base-sepolia"
        className="hover:text-blue-600 cursor-pointer"
      >
        GitHub
      </a>
      <button
        onClick={handleDisconnect}
        className="hover:text-blue-600 cursor-pointer"
      >
        Disconnect
      </button>
    </footer>
  )
};