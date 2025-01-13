import { useState } from "react";
import useBasedCartFactory from "@/hooks/useBasedCartFactory";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type FormErrors = {
  cartName?: string;
  cartAmount?: string;
  cartItem?: string;
};

export default function NewCartModal() {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [cartItemsArray, setCartItemsArray] = useState<string[]>([]);
  const [cartAmount, setCartAmount] = useState<string>('');
  const [cartItem, setCartItem] = useState<string>('');
  const [cartName, setCartName] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isAwaitingCreateCart, setIsAwaitingCreateCart] = useState<boolean>(false);
  const { approveUsdcAndCreateCartAsync } = useBasedCartFactory();

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleCreateCart = async () => {
    const newErrors: FormErrors = {};
    if (cartName.trim() === "") {
      newErrors.cartName = 'Cart name cannot be empty';
      setCartName('');
    } else if (cartAmount.trim() === "") {
      newErrors.cartAmount = 'Amount cannot be empty';
      setCartAmount('');
    } else if (isNaN(Number(cartAmount))) {
      newErrors.cartAmount = 'Amount must be a number';
      setCartAmount('');
    } else if (Number(cartAmount) <= 0) {
      newErrors.cartAmount = 'Amount must be greater than 0';
      setCartAmount('');
    } else if (cartItemsArray.length === 0) {
      newErrors.cartItem = 'Cart must have at least one item';
    }
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    try {
      setIsAwaitingCreateCart(true);
      await approveUsdcAndCreateCartAsync(cartName, Number(cartAmount), cartItemsArray);
      setFormErrors({});
      setIsAwaitingCreateCart(false);
    } catch (error) {
      console.error('Error creating cart', error);
      setIsAwaitingCreateCart(false);
    } finally {
      setShowOptions(false);
      setCartItemsArray([]);
      setCartAmount('');
      setCartItem('');
      setCartName('');
    }
  }

  const handleAddItems = () => {
    if (cartItemsArray.includes(cartItem.trim())) {
      setFormErrors({ cartItem: 'Item is already in the cart' });
      setCartItem('');
      return;
    }
    if (cartItem.trim() === "") {
      setFormErrors({ cartItem: 'Item name cannot be empty' });
      setCartItem('');
      return;
    }
    setCartItemsArray([...cartItemsArray, cartItem]);
    setCartItem("");
  };

  const handleRemoveItem = (item: string) => {
    setCartItemsArray(cartItemsArray.filter((i) => i !== item));
  };

  return (
    <div className="w-full flex flex-col">
      <div 
        className="text-center border-b rounded-lg py-4 flex justify-around items-center hover:text-blue-600 cursor-pointer"
        onClick={handleShowOptions}
      >
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
          Create a Cart
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${showOptions ? "rotate-180" : ""}`} />
      </div>

      {showOptions && (
        <div className="p-2 flex flex-col gap-4">

          <div className="flex justify-between items-center mt-4">
            <label className="flex">Cart Name:</label>
            <input 
              className="text-black p-1" 
              type="text" 
              value={cartName}
              onChange={(e) => setCartName(e.target.value)}
              onFocus={() => setFormErrors({})}
              disabled={isAwaitingCreateCart}
            />
          </div>
          <p className="text-red-500 text-sm">{formErrors.cartName}</p>

          <div className="flex justify-between items-center">
            <label className="flex">Amount:</label>
            <input 
              className="text-black p-1" 
              type="text" 
              placeholder="0"
              value={cartAmount}
              onChange={(e) => setCartAmount(e.target.value)}
              onFocus={() => setFormErrors({})}
              disabled={isAwaitingCreateCart}
            />
          </div>
          <p className="text-red-500 text-sm">{formErrors.cartAmount}</p>

          <div className="flex justify-center w-full items-center">
            <input 
              className="text-black p-1 flex-grow"
              type="text" 
              placeholder="Add to cart"
              value={cartItem}
              onChange={(e) => setCartItem(e.target.value)}
              onFocus={() => setFormErrors({})}
              disabled={isAwaitingCreateCart}
            />
            <button 
              className={`border bg-black p-1 flex-grow rounded-lg ${isAwaitingCreateCart ? 'pointer-events-none' : ''}`}
              onClick={handleAddItems}
              disabled={isAwaitingCreateCart}
            >
              Add
            </button>
          </div>
          <p className="text-red-500 text-sm">{formErrors.cartItem}</p>

          <div className="flex-1 overflow-y-auto max-h-[40vh]">
            <ul className={`grid grid-cols-2 gap-2 ${isAwaitingCreateCart ? 'pointer-events-none opacity-50' : ''}`}>
            {cartItemsArray.map((item, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-md mb-2 bg-gray-100 text-black">
                <p>{item}</p>
                <span className="text-red-500 rounded-lg px-2 hover:text-red-800 cursor-pointer" onClick={() => handleRemoveItem(item)}>X</span>
              </li>
            ))}
            </ul>
          </div>

          <button 
            className={`border bg-black p-2 rounded-lg ${isAwaitingCreateCart ? 'pointer-events-none' : ' hover:text-blue-600 cursor-pointer'}`}
            onClick={handleCreateCart}
            disabled={isAwaitingCreateCart}
          >
            {isAwaitingCreateCart ? 'Processing...' : 'Create Cart'}
          </button>

        </div>
      )}
    </div>
  )
};