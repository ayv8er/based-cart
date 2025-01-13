import { useState } from "react";
import Cart from "./Cart";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import useWallet from "@/hooks/useWallet";

type CartData = {
  address: string;
  name: string, 
  items: string[], 
  isCompleted: boolean, 
  funds: string, 
  fulfiller: string | null, 
  owner: string,
};

export default function AllCartClaimed({otherCarts, handleCartClick}: {otherCarts: CartData[], handleCartClick: (cart: CartData) => void}) {
  const [showOptions, setShowOptions] = useState(true);
  const { address } = useWallet();

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const claimedCarts = otherCarts.filter((cart) => cart.fulfiller === address);

  return (
    <>
      <div 
        className="text-center border-b rounded-lg py-4 flex justify-around items-center hover:text-blue-600 cursor-pointer"
        onClick={handleShowOptions}
        >
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
          Your Claimed Carts
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
      </div>
      {showOptions && claimedCarts.length === 0 && (
        <div className="w-full px-4 flex items-center justify-center">
          <p className="text-center">You have no claimed carts</p>
        </div>
      )}
      {showOptions && (
        <div className="p-2 flex flex-col gap-4">
          {claimedCarts.map((cart) => {
            const { 
              address, 
              name, 
              items, 
              isCompleted,
              funds,
              fulfiller,
              owner
            } = cart;

            return (
              <Cart 
                key={address} 
                address={address}
                name={name}
                items={items}
                isCompleted={isCompleted}
                funds={funds}
                fulfiller={fulfiller}
                owner={owner}
                onClick={() => handleCartClick(cart)}
              />
            )
          })}
        </div>
      )}
    </>
  )
};