import { useState } from "react";
import useAllBasedCarts from "@/hooks/useAllBasedCarts";
import AllCartOverlay from "./AllCartOverlay";
import AllCartClaimed from "./AllCartClaimed";
import AllCartUnclaimed from "./AllCartUnclaimed";

type CartData = {
  address: string;
  name: string, 
  items: string[], 
  isCompleted: boolean, 
  funds: string, 
  fulfiller: string | null, 
  owner: string,
};

export default function AllCartContainer() {
  const [selectedCart, setSelectedCart] = useState<CartData | null>(null);
  const { otherCarts } = useAllBasedCarts();

  const handleCartClick = (cart: CartData) => {
    setSelectedCart(cart);
  };

  return (
    <div className="px-4 space-y-4">
      <AllCartClaimed otherCarts={otherCarts} handleCartClick={handleCartClick}/>
      <AllCartUnclaimed otherCarts={otherCarts} handleCartClick={handleCartClick}/>

      {selectedCart && (
        <AllCartOverlay
          cart={selectedCart}
          onClose={() => setSelectedCart(null)}
        />
      )}
    </div>
  )
};