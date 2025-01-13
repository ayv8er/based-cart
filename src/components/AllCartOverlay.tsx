import AllCartOverlayItems from "./AllCartOverlayItems";
import AllCartOverlayClaim from "./AllCartOverlayClaim";
import { useAccount } from "wagmi";

export type CartData = {
  address: string;
  name: string, 
  items: string[], 
  isCompleted: boolean, 
  funds: string, 
  fulfiller: string | null,
  owner: string,
};

interface AllCartOverlayProps {
  cart: CartData;
  onClose: () => void;
}

export default function AllCartOverlay({ cart, onClose }: AllCartOverlayProps) {
  const { 
    address, 
    name, 
    items, 
    isCompleted, 
    funds, 
    fulfiller,
  } = cart;
  const { address: account } = useAccount();

  const handleOverlayClick = () => onClose();
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  const statusColor = isCompleted
  ? "bg-red-500"
  : fulfiller === null
    ? "bg-green-500"
    : "bg-yellow-500";

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-black border rounded-md p-4 w-[325px] flex flex-col max-h-[60vh] justify-between space-y-4"
        onClick={handleContentClick}
      >
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-2">{name}</h2>
            <p className="text-white">Balance: ${funds}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
              <p className="text-white mx-2">{isCompleted ? "Completed" : fulfiller === null ? "Unclaimed" : "In Progress"}</p>
            </div>
            {fulfiller !== null && (
              <p className="text-white">{fulfiller === account ? "Claimed by you" : "By: " + fulfiller.slice(0, 5) + "..." + fulfiller.slice(-4)}</p>
            )}
          </div>
        </div>
        <AllCartOverlayItems items={items} />
        <AllCartOverlayClaim 
          address={address}
          fulfiller={fulfiller}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  )
};