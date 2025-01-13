import { useState } from "react";
import useAllBasedCarts from "@/hooks/useAllBasedCarts";
import NewCartModal from "./NewCartModal";    
import MyCartOverlay from "./MyCartOverlay";
import Cart from "./Cart";

export type CartData = {
  address: string;
  name: string, 
  items: string[], 
  isCompleted: boolean, 
  funds: string, 
  fulfiller: string | null,
  owner: string,
};

export default function MyCartContainer() {
  const { myCarts } = useAllBasedCarts();
  const [selectedCart, setSelectedCart] = useState<CartData | null>(null);

  const handleCartClick = (cart: CartData) => {
    setSelectedCart(cart);
  };
  
  return (
    <div className="px-4 space-y-4">
      <NewCartModal />
      {myCarts.map((cart) => {
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

      {selectedCart && (
        <MyCartOverlay
          cart={selectedCart}
          onClose={() => setSelectedCart(null)}
        />
      )}
    </div>
  )
};